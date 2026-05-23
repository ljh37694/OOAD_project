package com.sma.backend.service;

import com.sma.backend.domain.Subscription;
import com.sma.backend.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationsScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final JavaMailSender mailSender;

    // 매일 오전 9시에 실행
    @Scheduled(cron = "0 0 9 * * *")
    public void checkDailySchedule() {
        log.info("결제 예정 구독 서비스 일일 스케줄러 점검 시작");
        
        // 1. 내일 날짜 구하기 (yyyy-MM-dd 포맷)
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        String tomorrowPrefix = tomorrow.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        
        // 2. 내일 결제 예정인 모든 활성 구독 조회
        List<Subscription> subscriptions = subscriptionRepository
                .findByStatusAndNextPaymentDateStartingWith("Active", tomorrowPrefix);
        
        if (subscriptions.isEmpty()) {
            log.info("내일({}) 결제 예정인 구독 서비스가 없습니다.", tomorrowPrefix);
            return;
        }

        // 3. 사용자 이메일별로 그룹화
        Map<String, List<Subscription>> groupedByUser = subscriptions.stream()
                .filter(s -> s.getUserEmail() != null && !s.getUserEmail().isEmpty())
                .collect(Collectors.groupingBy(Subscription::getUserEmail));

        // 4. 사용자별 단일 이메일 발송
        for (Map.Entry<String, List<Subscription>> entry : groupedByUser.entrySet()) {
            String userEmail = entry.getKey();
            List<Subscription> userSubs = entry.getValue();
            
            sendSummaryEmail(userEmail, userSubs, tomorrowPrefix);
        }
    }

    private void sendSummaryEmail(String toEmail, List<Subscription> subs, String dateStr) {
        // 이메일 본문 생성
        StringBuilder body = new StringBuilder();
        body.append(String.format("안녕하세요! SMA(구독 관리 서비스) 알림입니다.\n\n"));
        body.append(String.format("내일(%s) 결제 예정인 구독 서비스 내역입니다.\n", dateStr));
        body.append("--------------------------------------------------\n");

        int totalAmount = 0;
        for (Subscription sub : subs) {
            String name = sub.getName() != null ? sub.getName() : "이름 없음";
            int price = sub.getSelectedPrice() != null ? sub.getSelectedPrice() : 0;
            totalAmount += price;
            body.append(String.format("- %s : ₩%s\n", name, String.format("%,d", price)));
        }
        
        body.append("--------------------------------------------------\n");
        body.append(String.format("총 결제 예정 금액: ₩%s\n\n", String.format("%,d", totalAmount)));
        body.append("불필요한 지출이 발생하지 않도록 미리 확인하시고, ");
        body.append("해지 또는 일시 정지를 원하시면 서비스 앱에서 상태를 변경해주세요.\n\n");
        body.append("감사합니다.\n");
        body.append("SMA Team 드림\n");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(String.format("[SMA] 내일(%s) 구독 결제 예정 내역 알림", dateStr));
        message.setText(body.toString());

        try {
            mailSender.send(message);
            log.info("알림 메일 발송 성공: {} (구독 개수: {}개, 총 금액: ₩{})", 
                    toEmail, subs.size(), String.format("%,d", totalAmount));
        } catch (Exception e) {
            // 메일 설정이 빈 상태거나 오류 발생 시 콘솔 로그에 이메일 내용을 출력하여 작동 여부를 확인할 수 있도록 친절하게 지원합니다.
            log.warn("이메일 발송 중 오류가 발생하여 콘솔 로그로 대체 출력합니다. " +
                    "(실제 메일을 발송하려면 .env 파일에 MAIL_USERNAME 및 MAIL_PASSWORD를 입력해야 합니다.)");
            
            System.out.println("\n================ [MOCK EMAIL CONSOLE LOG] ================");
            System.out.println("To: " + toEmail);
            System.out.println("Subject: " + message.getSubject());
            System.out.println("Content:\n" + message.getText());
            System.out.println("===========================================================\n");
        }
    }

    public void sendTestEmail(String toEmail) {
        log.info("테스트 메일 전송 요청 수신: {}", toEmail);
        
        Subscription netflix = new Subscription();
        netflix.setName("넷플릭스 (Netflix)");
        netflix.setSelectedPrice(17000);
        netflix.setUserEmail(toEmail);
        netflix.setStatus("Active");
        
        Subscription youtube = new Subscription();
        youtube.setName("유튜브 프리미엄 (YouTube Premium)");
        youtube.setSelectedPrice(14900);
        youtube.setUserEmail(toEmail);
        youtube.setStatus("Active");
        
        List<Subscription> dummySubs = List.of(netflix, youtube);
        String tomorrowStr = LocalDate.now().plusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        
        sendSummaryEmail(toEmail, dummySubs, tomorrowStr);
    }
}

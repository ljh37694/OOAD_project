package com.sma.backend.controller;

import com.sma.backend.service.NotificationsScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class EmailTestController {

    private final NotificationsScheduler notificationsScheduler;

    // 스케줄러를 수동으로 강제 트리거
    @PostMapping("/trigger-scheduler")
    public String triggerScheduler() {
        notificationsScheduler.checkDailySchedule();
        return "스케줄러가 강제 실행되었습니다. 서버 콘솔 로그 또는 메일 수신함을 확인하세요.";
    }

    // 스케줄러를 GET으로도 실행할 수 있도록 지원 (테스트 편의성)
    @GetMapping("/trigger-scheduler")
    public String triggerSchedulerGet() {
        notificationsScheduler.checkDailySchedule();
        return "스케줄러가 강제 실행되었습니다. 서버 콘솔 로그 또는 메일 수신함을 확인하세요.";
    }

    // 샘플 이메일 전송 테스트
    @GetMapping("/send-sample-email")
    public String sendSampleEmail(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            return "이메일 주소를 입력해 주세요. (예: ?email=test@example.com)";
        }
        notificationsScheduler.sendTestEmail(email);
        return email + " 주소로 샘플 이메일 발송 작업을 실행했습니다. 서버 콘솔 로그 또는 메일 수신함을 확인하세요.";
    }
}

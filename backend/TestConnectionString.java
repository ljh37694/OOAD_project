import com.mongodb.ConnectionString;
public class TestConnectionString {
    public static void main(String[] args) {
        try {
            ConnectionString cs = new ConnectionString("mongodb+srv://ljh37694:ruv3116*jiwon@forum.6p5dx3j.mongodb.net/Forum?retryWrites=true&w=majority");
            System.out.println("Parsed successfully!");
            System.out.println("Database: " + cs.getDatabase());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

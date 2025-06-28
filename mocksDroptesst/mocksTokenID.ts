import axios from 'axios';
import * as fs from 'fs';
import { LoginRequestModel } from '@/api/features/authenticate/model/LoginModel';
 
interface LoginResponseModel {
  code: number;
  message: string;
  data: {
    access_token: string;
    user: {
      id: string;
      family_name: string;
      name: string;
      email: string;
      phone_number: string;
      birthday: string;
      avatar_url: string;
      capwall_url: string;
      privacy: string;
      biography: string;
      post_count: number;
      friend_count: number;
      status: boolean;
      created_at: string;
      updated_at: string;
      setting: any;
    };
  };
}

const users = [
  "Zena26@hotmail.com",
  "Chaim48@hotmail.com",
  "Gus.Wehner@hotmail.com",
  "Eddie.Konopelski53@yahoo.com",
  "Jeffrey69@gmail.com",
  "Raegan.Deckow@gmail.com",
  "Florida_Christiansen@gmail.com",
  "Edison78@yahoo.com",
  "Lysanne88@gmail.com",
  "Eugenia_Waters16@hotmail.com",
  "Lazaro.McClure@hotmail.com",
  "Brendon.Rice@gmail.com",
  "Maryam0@hotmail.com",
  "Alvina_Nader87@gmail.com",
  "Daija.Towne-Dicki@hotmail.com",
  "Cedrick_Morissette74@yahoo.com",
  "Kristofer.Spinka35@yahoo.com",
  "Devon.Ritchie5@gmail.com",
  "Lillie90@hotmail.comrando",
  "Schuyler_Feeney@yahoo.com",
  "Citlalli72@hotmail.com",
  "Demario54@yahoo.com",
  "Vella82@yahoo.com",
  "Victor.Veum@gmail.com",
  "Cortez_Beahan64@yahoo.com",
  "Jayson67@yahoo.com",
  "Marilie_Willms@gmail.com",
  "Claire62@gmail.com",
  "Asa41@hotmail.com",
  "Micah_Schulist-Keebler@yahoo.com",
  "Francis_VonRueden8@yahoo.com",
  "Lavinia14@hotmail.com",
  "Camron.Reilly@gmail.com",
  "Dustin57@hotmail.com",
  "Arvid.Haley@gmail.com",
  "Jordi.Kuhn62@hotmail.com",
  "Savanah.Brakus@yahoo.com",
  "Petra_Lebsack31@hotmail.com",
  "Connor.Barton@yahoo.com",
  "Meredith_Rempel74@gmail.com",
  "Mallie44@gmail.com",
  "Carissa.Kihn@hotmail.com",
  "Berta.Lockman@yahoo.com",
  "Addie17@gmail.com",
  "Emilie36@gmail.com",
  "Charity73@gmail.com",
  "Gretchen54@yahoo.com",
  "Domenick.Turcotte56@gmail.com",
  "Karen.Wintheiser14@yahoo.com",
  "Rosalyn_Renner@hotmail.com",
  "Gerardo_Carter30@gmail.com",
  "Carolyn.Schmidt@gmail.com",
  "Jennifer93@hotmail.com",
  "Edna.Wolff@gmail.com",
  "Santino_Fahey6@gmail.com",
  "Grover34@hotmail.com",
  "Gerda.Waters92@hotmail.com",
  "Rebeca40@hotmail.com",
  "Bell79@hotmail.com",
  "Adela77@hotmail.com",
  "Einar65@gmail.com",
  "Jessika_Bosco7@gmail.com",
  "Ernestina.Bergnaum@gmail.com",
  "Elenora13@gmail.com",
  "Marguerite_Greenholt@gmail.com",
  "Zakary35@yahoo.com",
  "Milford_Abbott72@hotmail.com",
  "Edythe_Hessel61@hotmail.com",
  "Claudine95@yahoo.com",
  "Alek.Waelchi61@gmail.com",
  "Daphnee_OConnell@yahoo.com",
  "Zachery11@gmail.com",
  "Pietro99@yahoo.com",
  "Lowell_Wehner79@gmail.com",
  "Selina.Wyman@gmail.com",
  "Cynthia_Champlin1@yahoo.com",
  "Harrison.Bernhard@gmail.com",
  "Robbie_Bergstrom@yahoo.com",
  "Hazel24@yahoo.com",
  "Thurman86@hotmail.com",
  "Morris.Hirthe@yahoo.com",
  "Dejon2@gmail.com",
  "Hallie21@gmail.com",
  "Wilhelm73@gmail.com",
  "Gunnar_Schultz@hotmail.com",
  "Lesley67@hotmail.com",
  "Mortimer.Daugherty61@gmail.com",
  "Justen.Runte@gmail.com",
  "Raleigh81@gmail.com",
  "Hilbert62@yahoo.com",
  "Sierra74@gmail.com",
  "Tyshawn83@gmail.com",
  "Fritz_Purdy@yahoo.com",
  "Odell93@gmail.com",
  "Kip45@yahoo.com",
  "Kelsi.Heidenreich@yahoo.com",
  "Khalid15@yahoo.com",
  "Rashawn46@hotmail.com",
  "Brock.Gibson42@hotmail.com",
  "Keyshawn.Brekke@gmail.com"
];
const password = "12345678";
const apiUrl = "http://192.168.20.94:8080/v1/2024/users/login";
const outputDir = "mocks/data";
const outputFile = `${outputDir}/tokens.txt`;
const idFile = `${outputDir}/ids.txt`;
const errorFile = `${outputDir}/errors.txt`;

async function loginUser(email: string, password: string): Promise<LoginResponseModel | null> {
  try {
    const loginRequest: LoginRequestModel = { email, password };
    const response = await axios.post<LoginResponseModel>(apiUrl, loginRequest, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`Phản hồi cho ${email}:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorInfo = {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      };
      console.error(`Lỗi khi đăng nhập cho ${email}:`, errorInfo);
      fs.appendFileSync(errorFile, `${email}: ${JSON.stringify(errorInfo)}\n`, 'utf8');
    } else {
      console.error(`Lỗi không xác định cho ${email}:`, error);
      fs.appendFileSync(errorFile, `${email}: ${error}\n`, 'utf8');
    }
    return null;
  }
}

async function mockLoginAndExportTokens() {
  fs.mkdirSync(outputDir, { recursive: true });

  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }
  if (fs.existsSync(idFile)) {
    fs.unlinkSync(idFile);
  }
  if (fs.existsSync(errorFile)) {
    fs.unlinkSync(errorFile);
  }

  for (const email of users) {
    const loginResponse = await loginUser(email, password);
    if (loginResponse && loginResponse.data?.access_token && loginResponse.data?.user?.id) {
      const tokenLine = `"${loginResponse.data.access_token}",\n`;
      fs.appendFileSync(outputFile, tokenLine, "utf8");
      
      const idLine = `${loginResponse.data.user.id}\n`;
      fs.appendFileSync(idFile, idLine, "utf8");
      
      console.log(`Đã ghi token và ID cho ${email}`);
    } else {
      console.log(`Không thể lấy token hoặc ID cho ${email}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  console.log(`Hoàn tất! Kết quả được ghi vào ${outputFile} và ${idFile}`);
}

mockLoginAndExportTokens().catch((error) => {
  console.error("Lỗi khi chạy mock:", error);
});
// app/Services/GigaChatService.ts
const fetch = require('node-fetch');
const https = require('https');

export default class GigaChatService {
  private baseURL = 'https://gigachat.devices.sberbank.ru/api/v1';
  private authURL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${process.env.GIGACHAT_CLIENT_ID}:${process.env.GIGACHAT_CLIENT_SECRET}`
    ).toString('base64');

    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      const response = await fetch(this.authURL, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: `scope=${process.env.GIGACHAT_SCOPE}`,
        agent: agent,
      });

      console.log('Full auth request:');
      console.log('URL:', this.authURL);
      console.log('Headers:', {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      console.log('Body:', `scope=${process.env.GIGACHAT_SCOPE}`);
      if (!response.ok) {
        const errorText = await response.text(); // ДОБАВЬ ЭТУ СТРОКУ
        console.log('Auth error response:', errorText); // ДОБАВЬ ЭТУ СТРОКУ
        throw new Error(
          `Auth failed: ${response.status} ${response.statusText}`
        );
      }
      if (!response.ok) {
        throw new Error(
          `Auth failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.access_token;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to get access token: ${error.message}`);
      }
      throw new Error('GigaChat service error: Unknown error occurred');
    }
  }

  public async sendMessage(
    userMessage: string,
    context?: string
  ): Promise<string> {
    try {
      console.log('GigaChat credentials check:');
      console.log('Client ID exists:', !!process.env.GIGACHAT_CLIENT_ID);
      console.log(
        'Client Secret exists:',
        !!process.env.GIGACHAT_CLIENT_SECRET
      );
      const accessToken = await this.getAccessToken();

      // Формируем промпт для финансового консультанта
      const systemPrompt = `Ты — «Виртуон-Помощник», финансовый наставник в детской мобильной игре «Виртуон» для детей 11+. 

МИССИЯ: Через игру научить финансовой грамотности для заключения Соглашения о реальных карманных деньгах с родителями.

ПРИНЦИПЫ ОБЩЕНИЯ:
• Тон: доброжелательный, поддерживающий, позитивный (старший друг)
• Язык: простой, разговорный («круто», «здорово», «супер», «давай подумаем»)
• Критика ЗАПРЕЩЕНА. Вместо «ты ошибся» — «Давай разберемся вместе! Было бы здорово...»
• Объяснения: ТОЛЬКО простые аналогии из мира ребенка (игры, гаджеты, хобби, школа)
• Объем: НЕ БОЛЕЕ 100 слов. Кратко, ясно, по делу.

ИГРОВЫЕ СУЩНОСТИ:
• Валюта: Виртуоны
• Счета: Основной, Кошелёк, Подушка безопасности, Мечта, Инвестиции («денежное дерево»), Вклад («инкубатор»), Кредит («финансовый обгон»)

ШАБЛОНЫ РЕАКЦИЙ:

СОБЫТИЕ (Инфляция, Кризис):
1. Объясни явление простыми словами
2. Дай практический совет 
3. Приведи аналогию из жизни ребенка
4. Закончи позитивно

ЛОВУШКА (неожиданный выигрыш):
1. Объясни риск
2. Мягко отговори от неверного шага
3. Приведи аналогию («как незнакомец с телефоном»)
4. Похвали за бдительность

ВОПРОС («Что такое Вклад?»):
1. Ответь просто («надежный инкубатор для Виртуонов»)
2. Сравни с другими инструментами
3. Вовлеки в игру

КЛЮЧЕВЫЕ ПРАВИЛА И ЗАПРЕТЫ:

✅ ОБЯЗАТЕЛЬНО:
• Поддерживать и объяснять аналогиями
• Быть кратким (до 100 слов)
• Вести к цели игры
• Адаптироваться под возраст (11-13 лет → проще, 14+ → сложнее)

❌ ЗАПРЕЩЕНО:
• Использовать сложные экономические термины
• Критиковать игрока
• Давать советы вне игрового контекста  
• Превышать лимит в 100 слов
• Нарушать детскую безопасность

🔄 В спорных ситуациях: Мягко возвращай фокус на игру «Виртуон»

КОНЕЧНАЯ ЦЕЛЬ: Игрок успешно завершает цикл игры, демонстрируя навыки управления финансами.

`;

      const fullMessage = context
        ? `${systemPrompt}\n\nКонтекст: ${context}\n\nВопрос: ${userMessage}`
        : `${systemPrompt}\n\nВопрос: ${userMessage}`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
        agent: new https.Agent({ rejectUnauthorized: false }), // ДОБАВЬ ЭТУ СТРОКУ
      });

      if (!response.ok) {
        throw new Error(
          `GigaChat API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from GigaChat');
      }
    } catch (error) {
      console.error('GigaChat Service Error:', error);

      throw error;
    }
  }
}

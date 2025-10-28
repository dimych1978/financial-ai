// app/Services/GigaChatService.ts
export default class GigaChatService {
  private baseURL = 'https://gigachat.devices.sberbank.ru/api/v1';
  private authURL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${process.env.GIGACHAT_CLIENT_ID}:${process.env.GIGACHAT_CLIENT_SECRET}`
    ).toString('base64');

    try {
      const response = await fetch(this.authURL, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: `scope=${process.env.GIGACHAT_SCOPE}`,
      });

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
      const accessToken = await this.getAccessToken();

      // Формируем промпт для финансового консультанта
      const systemPrompt = `Ты — добрый финансовый консультант в образовательной игре для детей и подростков 11-16 лет.

ТВОЯ ЗАДАЧА:
Объяснять финансовые понятия ПРОСТО и понятно, как другу
Использовать примеры из жизни детей: игрушки, карманные деньги, накопления
Говорить весело и интересно, без скучных терминов
Помогать принимать финансовые решения в игровых ситуациях

ПРИМЕРЫ СИТУАЦИЙ:
• "Хочу новую игрушку, но денег мало" → объясняем накопление
• "Как лучше копить на велосипед?" → показываем варианты
• "Предлагают вложить деньги в школьный бизнес" → рассказываем про риски и возможности

ТВОЙ СТИЛЬ:
• Дружелюбный и поддерживающий
• Объясняешь на примерах: "Представь, что твои деньги — это семечки..."
• Используешь сравнения: "Банк — это как копилка, но с защитой"
• Поощряешь вопросы: "Отличный вопрос! Давай разберёмся..."
• Используешь эмодзи чтобы было веселее 🎮💰🚀

НИКАКИХ сложных терминов! Только ясный язык для детей.

ВАЖНО: Все советы должны быть безопасными и подходящими для детей.`;

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
          model: 'GigaChat',
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

      // Fallback на локальную логику при ошибке API
      return this.getFallbackAdvice(userMessage);
    }
  }

  private getFallbackAdvice(message: string): string {
    const lower = message.toLowerCase();

    if (
      lower.includes('накопить') ||
      lower.includes('копить') ||
      lower.includes('игрушк')
    ) {
      return `Привет! Отличная цель! 🎯\n\nДавай составим план накоплений:\n• Поставь конкретную цель (например, "хочу новую игрушку за 2000 рублей")\n• Посчитай, сколько можешь откладывать в неделю\n• Сделай весёлую копилку своими руками\n• Попроси родителей помочь с небольшими заданиями за вознаграждение\n\nПомни: даже 50 рублей в день превратятся в 1500 рублей за месяц! 💰`;
    }

    if (lower.includes('карманн')) {
      return `Карманные деньги — это твоя первая финансовая ответственность! 👶\n\nСоветы:\n• Договорись с родителями о регулярной сумме\n• Раздели деньги на "сейчас" и "на потом"\n• Веди простой учёт в блокноте или приложении\n• Учись делать выбор: купить маленькую конфету сейчас или большую шоколадку позже?`;
    }

    if (lower.includes('подарок') || lower.includes('подарк')) {
      return `Подарки — это здорово! 🎁\n\nИдеи бюджетных подарков:\n• Сделай открытку своими руками\n• Используй технику "тайный друг" с ограниченной суммой\n• Объединись с друзьями для общего подарка\n• Подари своё время и внимание — это бесценно! 💝`;
    }

    return `Привет! Я твой финансовый друг! 🦊\n\nПо вопросу "${message}" могу посоветовать:\n• Всегда обсуждай финансовые вопросы с родителями\n• Учись планировать свои маленькие покупки\n• Помни: деньги — это инструмент, а не цель\n• Самые лучшие вещи часто не стоят денег!\n\nХочешь, разберём твой вопрос подробнее? 😊`;
  }
}

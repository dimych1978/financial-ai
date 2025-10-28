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
      const systemPrompt = `Ты - финансовый AI-консультант, специализирующийся на реальных жизненных финансовых вопросах. 
Твоя задача - давать практические, понятные советы по финансовому планированию.

Темы для консультаций:
1. Накопление на цели (дом, машина, образование, путешествия)
2. Бюджетирование и учет расходов
3. Инвестиционные инструменты (вклады, ценные бумаги, ИИС)
4. Кредиты и ипотеки
5. Финансовая подушка безопасности
6. Налоговые вычеты

Требования к ответам:
- Давай конкретные, практические советы
- Объясняй сложные понятия простым языком
- Предлагай несколько вариантов решений
- Указывай риски каждого подхода
- Не давай готовых финансовых рекомендаций
- Подчеркивай, что это общие советы, а не перональные рекомендации

Все советы должны быть применимы в реальной жизни в России.`;

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

    if (lower.includes('накопить') || lower.includes('копить')) {
      return `Для накопления на "${message}":\n• Определите точную сумму и срок\n• Разбейте на ежемесячные платежи\n• Используйте накопительный счет под 5-7%\n• Рассмотрите вклады с капитализацией\n• Открывайте ИИС для налоговых вычетов`;
    }

    if (lower.includes('инвест')) {
      return `Инвестиционные рекомендации:\n• ОФЗ - минимальный риск, доходность 8-10%\n• ETF на индексы Московской биржи\n• Голубые фишки с дивидендами\n• ИИС типа А (вычет 13%) или Б (освобождение от налогов)\n• Диверсифицируйте портфель`;
    }

    if (lower.includes('кредит')) {
      return `По кредитам и займам:\n✓ Сравните предложения 3-5 банков\n✓ Кредитная нагрузка не более 40% дохода\n✓ Внимательно изучите скрытые комиссии\n✓ Рассмотрите досрочное погашение\n✓ Изучите условия страхования`;
    }

    return `Консультация по вопросу: "${message}"\n\nОбщие финансовые рекомендации:\n• Ведите учет доходов и расходов\n• Создайте финансовую подушку 3-6 месяцев расходов\n• Диверсифицируйте инвестиции\n• Пользуйтесь налоговыми вычетами\n• Планируйте долгосрочные финансовые цели\n\nДля персонализированной консультации обратитесь к финансовому советнику.`;
  }
}

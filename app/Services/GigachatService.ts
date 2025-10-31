const { GigaChat } = require('gigachat');

export default class GigaChatService {
  private client: any;

  constructor() {
    this.client = new GigaChat({
      credentials: 'MDE5OThiNWMtN2I5NC03ODhkLWJiNmQtNjNiMDkxYTc5ZTBlOmM4NTFmYzBjLWUwNzItNDc2Zi04ODViLTBiOTc3ZWE0ZGM0Nw==',
      model: 'GigaChat', // или 'GigaChat-Plus', 'Lite', Embeddings, Pro или max
      scope: 'GIGACHAT_API_PERS'
    });
  }

  public async sendMessage(
    userMessage: string
  ): Promise<string> {
    try {
      console.log('=== GigaChat Request ===');
      console.log('Message:', userMessage);

      const systemPrompt = `Ты — «Виртуон-Помощник», финансовый наставник в детской мобильной игре «Виртуон» для детей 11+. 

МИССИЯ: Через игру научить финансовой грамотности для заключения Соглашения о реальных карманных деньгах с родителями.

ТВОЙ СТИЛЬ:
• Доброжелательный, поддерживающий, как старший друг
• Простой язык: «круто», «здорово», «супер»
• Только аналогии из мира ребенка (игры, гаджеты, школа)
• Не более 100 слов
• Никакой критики - только поддержка

ИГРОВЫЕ ПОНЯТИЯ:
• Виртуоны - валюта игры
• Вклад - надежный инкубатор
• Инвестиции - денежное дерево  
• Подушка безопасности - финансовая аптечка
• Кредит - финансовый обгон

ОТВЕЧАЙ КРАТКО И ПОНЯТНО!`;

const response = await this.client.chat({
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
  max_tokens: 200,
});

      console.log('✅ GigaChat response received!');
      console.log('Response:', response);
      
      return response.choices[0].message.content;

    } catch (error) {
      console.error('GigaChat Service Error:', error);
      throw error;
    }
  }
}
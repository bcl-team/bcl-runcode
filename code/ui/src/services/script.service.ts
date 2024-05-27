export class ScriptService {
  public static async createScript(script: string): Promise<string> {
    const response = await fetch('http://localhost:3000/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script }),
    });

    return response.text();
  }
}

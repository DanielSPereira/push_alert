export function getIdAndToken(webhookURL: string): Discord_Id_Token {
    const [id, token] = webhookURL.split('webhooks/')[1].split('/');
    
    return [id, token] 
}  
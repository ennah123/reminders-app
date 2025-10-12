export function generateSimpleReminderEmail(reminder: {
  title: string;
  dueTime: Date;
}) {
  const formattedTime = new Date(reminder.dueTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background: #f5f5f5; 
            margin: 0; 
            padding: 20px; 
        }
        .container { 
            background: white; 
            border-radius: 10px; 
            padding: 30px; 
            max-width: 500px; 
            margin: 0 auto; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .header { 
            text-align: center; 
            margin-bottom: 25px; 
        }
        .emoji { 
            font-size: 40px; 
            margin-bottom: 10px; 
        }
        h2 { 
            color: #333; 
            margin: 0; 
        }
        .subtitle { 
            color: #666; 
            margin: 5px 0 0 0; 
        }
        .field { 
            margin-bottom: 20px; 
        }
        .label { 
            font-size: 12px; 
            color: #888; 
            text-transform: uppercase; 
            margin-bottom: 5px; 
        }
        .value { 
            font-size: 16px; 
            color: #333; 
            padding-bottom: 10px; 
            border-bottom: 1px solid #eee; 
        }
        .due-time { 

            font-weight: 600
        }
        .button { 
            display: block; 
            background: #333; 
            color: white; 
            text-align: center; 
            padding: 12px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin-top: 20px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emoji">⏰</div>
            <h2>Reminder Notification</h2>
            <p class="subtitle">This reminder is due now</p>
        </div>
        
        <div class="field">
            <div class="label">Reminder Title</div>
            <div class="value">${reminder.title}</div>
        </div>
        
        <div class="field">
            <div class="label">Due Date & Time</div>
            <div class="value due-time">${formattedTime}</div>
        </div>
        
        <a href="http://yourapp.com/reminders" class="button">View in App</a>
    </div>
</body>
</html>
  `;
}
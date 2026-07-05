#!/usr/bin/env python3
"""
بوت تيليغرام تجريبي لـ OMAR HOST
"""
import logging
import sys
from telegram import Update, BotCommand
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# إعداد التسجيل
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

TOKEN = '8537430970:AAGHMgTYpG5U3vKHC3P8Kr28ZQyp4qOC1tU'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """أمر /start"""
    user = update.effective_user
    name = user.first_name or 'مستخدم'
    await update.message.reply_text(
        f"👋 أهلاً {name}!\n\n"
        f"🚀 مرحباً بك في بوت OMAR HOST التجريبي\n\n"
        f"📋 الأوامر المتاحة:\n"
        f"/start - بدء البوت\n"
        f"/help - المساعدة\n"
        f"/status - حالة الخدمة\n"
        f"/info - معلومات عنك\n"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """أمر /help"""
    await update.message.reply_text(
        "🤖 بوت OMAR HOST التجريبي\n\n"
        "هذا البوت يستخدم لإشعارات منصة OMAR HOST لاستضافة السيرفرات.\n\n"
        "الأوامر:\n"
        "/start - بدء البوت\n"
        "/help - عرض المساعدة\n"
        "/status - حالة الخدمة\n"
        "/info - معلوماتك\n"
    )

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """أمر /status"""
    await update.message.reply_text(
        "✅ حالة الخدمة: تعمل بشكل طبيعي\n\n"
        "🌐 OMAR HOST VPS Platform\n"
        "💚 السيرفر: متصل\n"
        "🔥 البوت: يعمل\n"
    )

async def info(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """أمر /info"""
    user = update.effective_user
    chat = update.effective_chat
    await update.message.reply_text(
        f"👤 معلوماتك:\n\n"
        f"🆔 ID: {user.id}\n"
        f"📛 الاسم: {user.full_name}\n"
        f"🔤 المعرف: @{user.username or 'غير متوفر'}\n"
        f"💬 Chat ID: {chat.id}\n"
    )

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """الرد على الرسائل العادية"""
    await update.message.reply_text(
        f"📨 استلمت رسالتك!\n"
        f"للاستفادة من البوت استخدم الأوامر المتاحة.\n"
        f"اكتب /help لعرض قائمة الأوامر."
    )

def main() -> None:
    """تشغيل البوت"""
    application = Application.builder().token(TOKEN).build()

    # إضافة الأوامر
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("status", status))
    application.add_handler(CommandHandler("info", info))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    logger.info("🚀 بوت OMAR HOST يعمل الآن...")
    print("✅ البوت يعمل! ابحث عن @rlh6060606bot في تيليغرام")
    print("اضغط Ctrl+C لإيقاف البوت")
    
    # تشغيل البوت
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()

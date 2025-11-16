/**
 * GitHub emoji processing
 * Replaces jemoji Jekyll plugin functionality
 * 
 * Converts :emoji_name: syntax to Unicode emoji characters
 */

// Common emoji mappings (subset of GitHub emoji)
// For full emoji support, consider using a library like 'node-emoji'
const emojiMap: Record<string, string> = {
  // Smileys & Emotion
  'smile': '😄',
  'laughing': '😆',
  'blush': '😊',
  'heart': '❤️',
  'heart_eyes': '😍',
  'kissing_heart': '😘',
  'relaxed': '☺️',
  'grin': '😁',
  'wink': '😉',
  'stuck_out_tongue': '😛',
  'stuck_out_tongue_winking_eye': '😜',
  'stuck_out_tongue_closed_eyes': '😝',
  'neutral_face': '😐',
  'expressionless': '😑',
  'confused': '😕',
  'thinking': '🤔',
  'flushed': '😳',
  'disappointed': '😞',
  'worried': '😟',
  'angry': '😠',
  'rage': '😡',
  'cry': '😢',
  'sob': '😭',
  'joy': '😂',
  'sweat': '😓',
  'scream': '😱',
  'tired_face': '😫',
  'sleeping': '😴',
  'thumbsup': '👍',
  '+1': '👍',
  'thumbsdown': '👎',
  '-1': '👎',
  'ok_hand': '👌',
  'punch': '👊',
  'fist': '✊',
  'v': '✌️',
  'wave': '👋',
  'raised_hand': '✋',
  'clap': '👏',
  'pray': '🙏',
  
  // Objects & Symbols
  'rocket': '🚀',
  'bulb': '💡',
  'fire': '🔥',
  'sparkles': '✨',
  'star': '⭐',
  'star2': '🌟',
  'trophy': '🏆',
  'medal': '🏅',
  'zap': '⚡',
  'boom': '💥',
  'checkmark': '✅',
  'white_check_mark': '✅',
  'x': '❌',
  'warning': '⚠️',
  'exclamation': '❗',
  'question': '❓',
  'memo': '📝',
  'book': '📖',
  'books': '📚',
  'pencil2': '✏️',
  'page_facing_up': '📄',
  'inbox_tray': '📥',
  'outbox_tray': '📤',
  'email': '✉️',
  'package': '📦',
  'lock': '🔒',
  'unlock': '🔓',
  'key': '🔑',
  'mag': '🔍',
  'link': '🔗',
  'wrench': '🔧',
  'nut_and_bolt': '🔩',
  'hammer': '🔨',
  'gear': '⚙️',
  'computer': '💻',
  'iphone': '📱',
  'cloud': '☁️',
  'chart_with_upwards_trend': '📈',
  'chart_with_downwards_trend': '📉',
  'calendar': '📅',
  'hourglass': '⌛',
  'clock': '🕐',
  
  // Nature
  'sunny': '☀️',
  'umbrella': '☂️',
  'snowflake': '❄️',
  'tree': '🌲',
  'seedling': '🌱',
  'herb': '🌿',
  'leaves': '🍃',
  'four_leaf_clover': '🍀',
};

/**
 * Convert :emoji_name: syntax to Unicode emoji
 */
export function processEmoji(text: string): string {
  return text.replace(/:([a-z0-9_+\-]+):/g, (match, emojiName) => {
    return emojiMap[emojiName] || match;
  });
}

/**
 * Check if text contains emoji syntax
 */
export function hasEmojiSyntax(text: string): boolean {
  return /:([a-z0-9_+\-]+):/.test(text);
}

/**
 * Get list of available emoji names
 */
export function getAvailableEmoji(): string[] {
  return Object.keys(emojiMap);
}

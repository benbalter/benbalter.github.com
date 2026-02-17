/**
 * Key phrases for popular posts
 * 
 * Maps post slugs to an array of key phrases that should be bolded
 * for emphasis and improved readability.
 * 
 * These phrases represent memorable concepts, taglines, and takeaways
 * that make the posts more engaging and easier to scan.
 */

export const popularPostKeyPhrases: Record<string, string[]> = {
  '2015-11-12-why-urls': [
    'everything should have a URL',
    'single source of truth',
    'URLs democratize information',
    'knowledge work as craft',
    'the value of giving concepts URLs',
  ],
  '2022-03-17-why-async': [
    'asynchronous work',
    'async work',
    'remote-first',
    'knowledge workers',
    'communications debt',
    'parallelization and flow',
    'work-life balance',
    'discoverability and permanence',
  ],
  '2015-11-23-why-open-source': [
    'open source',
    'transparency',
    'meritocracy',
    'distributed collaboration',
  ],
  '2022-02-16-leaders-show-their-work': [
    'show their work',
    'showing your work',
    'communications debt',
    'transparency as an asset',
    'transparency as a liability',
    'institutional knowledge',
  ],
  '2023-01-10-manage-like-an-engineer': [
    'manage like an engineer',
    'servant leadership',
    'systems thinking',
    'first principles',
  ],
  '2023-04-20-meetings-are-a-point-of-escalation': [
    'meetings are a point of escalation',
    'point of escalation',
    'default to asynchronous',
    'prefer asynchronous communication',
  ],
  '2023-12-08-cathedral-bazaar-management': [
    'cathedral',
    'bazaar',
    'command and control',
    'organic collaboration',
  ],
  '2023-08-30-transparency-collaboration-is-the-andon-of-knowledge-production': [
    'andon cord',
    'transparency collaboration',
    'knowledge production',
    'psychological safety',
  ],
  '2023-08-04-remote-work-communicate-more-with-less': [
    'communicate more, less frequently',
    'batching communication',
    'notification fatigue',
    'high-signal communication',
  ],
};

import type { DialogueScript } from '@/utils/ink';

// ============================================================
// DAY 1 - Sizing up the player, establishing dominance, testing them
// ============================================================

const blaze_d1_low: DialogueScript = {
  id: 'blaze_d1_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*looks you up and down* So. You're one of the new ones. Gotta say, I expected... more.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "This island's got limited spots at the top. I've already scoped out the competition and let's just say I'm not worried. What about you -- you here to win or just here for the free drinks?",
      choices: [
        {
          text: '"I\'m here to win. And I don\'t need to announce it like you do."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I\'m just here to have a good time."',
          next: 'friendly',
          effects: { relationship_level: 2 },
        },
        {
          text: '"Not really your business, is it?"',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*ears flick forward* Oh? Quiet confidence. That's either very smart or very stupid. ...I kinda respect it either way. Alright, maybe you're not a total waste of my time.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*snorts* A good time? Sure, that's what they all say until the first recoupling. We'll see how relaxed you are then.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*narrows eyes* Touchy. That's fine. Just know that everything on this island is my business. Keep up or step aside -- I don't do second place.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Anyway. Welcome to the island or whatever. Try not to get eliminated on the first day. That'd just be embarrassing.",
    },
  },
};

const blaze_d1_mid: DialogueScript = {
  id: 'blaze_d1_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*catches your eye from across the pool* Hey. Come here. I want to size you up properly.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "*circles you slowly, tail flicking* You know, most people here are easy to read. The nervous ones, the desperate ones, the ones pretending to be tough. But you... you're harder to figure out. I respect that.",
      choices: [
        {
          text: '"Good. I\'d hate to be predictable. That\'s your thing, right?"',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Is this your way of giving a compliment?"',
          next: 'friendly',
          effects: { relationship_level: 4 },
        },
        {
          text: '"I don\'t need your assessment."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*genuine laugh* MY thing? Oh, you've got teeth. I like that. Most people just roll over when I flex. You actually pushed back. This could be fun.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*smirks* A compliment? From me? Let's call it a tactical observation. I'm noting you as someone to watch. Take that however you want.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "Everyone needs an assessment, whether they know it or not. But fine -- I'll save my observations for someone who appreciates good intel.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "First day's almost done. The real game starts tomorrow. If you want to last on this island, you might want to keep me on your side. Just a thought.",
    },
  },
};

const blaze_d1_high: DialogueScript = {
  id: 'blaze_d1_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*intercepts you before you reach the group* Hey. I don't do this, but I wanted to talk to you first. Before anyone else got the chance.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "There's something about you that's different from everyone else here. And I've got sharp instincts -- fox thing, you know. I can tell when someone's worth my time. And you? You definitely are.",
      choices: [
        {
          text: '"Careful, Blaze. That almost sounded like genuine interest instead of strategy."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That might be the nicest thing you\'ve said to anyone here."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"I\'ll believe that when I see it."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*tail stiffens, then relaxes* ...Okay. You caught me. Maybe it's not ENTIRELY strategy. Don't tell anyone I said that. I have a reputation to maintain.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*rubs the back of his neck* Yeah well, don't spread it around. I've got a very carefully constructed image going and 'nice' isn't part of the brand.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*shrugs, but his tail sways a little* Fair enough. I'll prove it then. I've never backed down from a challenge, and earning your attention? That's a challenge I'll take.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "This island just got a lot more interesting. See you around -- and trust me, you'll be seeing a lot of me.",
    },
  },
};

// ============================================================
// DAY 2 - Competitive banter, challenge talk, respects strength
// ============================================================

const blaze_d2_low: DialogueScript = {
  id: 'blaze_d2_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "So. Day two. I noticed you at the challenge earlier. Gotta say, your strategy was... interesting. By which I mean terrible.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "But hey, at least you didn't quit halfway through like some of the others. I can work with stubborn. Can't work with quitters.",
      choices: [
        {
          text: '"My strategy was to let you think you won. Phase two starts now."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I\'ll do better next time."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Not everyone treats everything like a competition, Blaze."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*stares, then grins slowly* Phase two? Oh I LIKE that. You're playing the long game. That's either brilliant or you're bluffing. Either way, I'm paying attention now.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Next time. See, that's the right attitude. Most people say 'it doesn't matter' -- that's loser talk. Saying 'next time' means you're still in the fight.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*scoffs* Everything IS a competition. People who say otherwise are just losing and trying to feel okay about it. No offense.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Anyway, keep training up. This island gets harder every day. And I'd hate for you to get boring before things get interesting.",
    },
  },
};

const blaze_d2_mid: DialogueScript = {
  id: 'blaze_d2_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "There you are. I was thinking about that move you pulled in the challenge. Genuinely didn't see it coming. And I ALWAYS see it coming.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "You know what separates winners from everyone else? It's not strength or speed. It's knowing when to play your hand. And you've got decent timing. For an amateur.",
      choices: [
        {
          text: '"Amateur? I thought I just beat your read. Sounds like the amateur might be you."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"Coming from you, that almost sounds like a compliment."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I wasn\'t trying to impress you."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*tail bristles, then he laughs* Okay, OW. Nobody talks to me like that. And the fact that you just did? That's either the bravest or dumbest thing I've seen this week. I'm going with bravest.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*crosses arms* It IS a compliment. I don't waste words on people who can't keep up. The fact that I'm standing here means something. Read into that.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "Didn't have to try. That's what made it impressive. But whatever, play it cool. I know potential when I see it, even if you don't want to own it.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Tomorrow's going to be tougher. Stick close -- I could use someone who doesn't fold under pressure. And yeah, that's a compliment. Don't make it weird.",
    },
  },
};

const blaze_d2_high: DialogueScript = {
  id: 'blaze_d2_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*jogs up to you* Okay I've been thinking about this all day and I need to say it. That challenge? You were incredible. Like, genuinely.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "I don't say that lightly. I grew up having to fight for everything, so I KNOW what a fighter looks like. And you? You've got something most people don't. This fire that doesn't need to shout.",
      choices: [
        {
          text: '"And you\'ve got a fire that can\'t stop shouting. Maybe together we balance out."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That means a lot coming from the most competitive fox on the island."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"I don\'t know about fire. I just did my best."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*goes quiet for a moment* ...Balance. Huh. Nobody's ever called my loudness something that could be BALANCED instead of just... toned down. That's a new one. I think I like it.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*stands a little taller* Most competitive? I'll take that trophy. But seriously, I don't hand out respect easily. You earned it today. Wear that.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "Your best? That was your BEST? Then your best is better than most people's everything. Own it. Seriously, modesty is overrated.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Hey -- I don't do teams usually. But if I was going to pick someone to have my back on this island? Today, you moved to the top of that very short list.",
    },
  },
};

// ============================================================
// DAY 3 - Shows knowledge of strategy and island survival, cunning side
// ============================================================

const blaze_d3_low: DialogueScript = {
  id: 'blaze_d3_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "Alright, let me give you a free piece of advice. You see that group over there? They've already formed an alliance. Day THREE. This place moves fast.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "I've been mapping the social dynamics since hour one. Who talks to who, who's faking, who's actually dangerous. It's all data. And data wins games.",
      choices: [
        {
          text: '"Interesting. So what does your data say about me?"',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"You think about this a lot, huh?"',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Sounds exhausting. Do you ever just... relax?"',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*tail flicks* ...My data says you're unpredictable. And that makes you either my best ally or my biggest threat. I haven't decided which yet.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Think about it? I live it. Where I grew up, if you weren't paying attention, you got left behind. Reading a room is survival, not strategy.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "Relax? *laughs sharply* Relaxed foxes become rugs. I'll relax when I've won. Maybe not even then.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Free tip's over. Next one costs you. But hey -- at least you know who the smart money's on.",
    },
  },
};

const blaze_d3_mid: DialogueScript = {
  id: 'blaze_d3_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*pulls you aside* Okay, I'm going to let you in on something because I think you can handle it. I've got a read on everyone here.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Blaze',
      text: "Half the people here are playing roles. The sweet one, the tough one, the mysterious one. I should know -- I'm playing one too. Difference is, I KNOW I'm doing it. Most of them don't.",
      choices: [
        {
          text: '"So what\'s under your role? The real Blaze -- is he as sharp as the performance?"',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"At least you\'re honest about being dishonest. That\'s kind of refreshing."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Sounds like a lonely way to go through life."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*pauses, caught off guard* The real Blaze? ...He's sharper. But also... I don't know, maybe a little tired of sharpening himself all the time. That stays between us.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*grins* Honest about being dishonest. I'm going to steal that line. But yeah -- I figure if you're going to play a game, at least know you're playing one.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*jaw tightens* Lonely? ...I was going to say 'effective,' but sure. Let's go with lonely. Doesn't change the fact that it works.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Anyway. I don't share intel with just anyone. The fact that I'm talking to you like this should tell you something. Read into it or don't.",
    },
  },
};

const blaze_d3_high: DialogueScript = {
  id: 'blaze_d3_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*finds you alone* Good, no audience. I want to talk to you without the performance. Can you handle that?",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Blaze',
      text: "I've been running strategy since I was a kit. Where I grew up, you either outthought everyone or you got stepped on. I learned to read body language before I could read actual books.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "But here's the thing I'm starting to realize -- with you, I keep forgetting to strategize. That's either really good or really dangerous.",
      choices: [
        {
          text: '"Maybe it\'s both. The best things usually are."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"I think it means you trust me. And that\'s a good thing."',
          next: 'friendly',
          effects: { relationship_level: 7 },
        },
        {
          text: '"Maybe you\'re just losing your edge."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*quiet for a moment* Both. Yeah. You know, nobody's ever made me feel like dropping my guard was worth the risk. And then you go and say something like that.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Trust. *exhales* That word used to make my fur stand on end. But hearing you say it... it doesn't sound so dangerous. That's new for me.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*flinches, then recovers* Losing my edge? ...Maybe. Or maybe I'm finding a different kind of sharpness. One that doesn't require claws.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "I've never talked to anyone like this. Don't expect it to become a regular thing. ...But also don't be surprised if it does.",
    },
  },
};

// ============================================================
// DAY 4 - Hints that the bravado is a mask -- accidental honesty
// ============================================================

const blaze_d4_low: DialogueScript = {
  id: 'blaze_d4_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*kicks at the sand* Whatever. Today was stupid. The challenge was rigged. ...Not really, but it felt like it.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "I hate losing. Not just dislike it -- I HATE it. Because where I'm from, losing means someone takes what's yours. And I've already lost enough to last a lifetime. ...Forget I said that.",
      choices: [
        {
          text: '"I\'m not going to forget it. That\'s the first real thing you\'ve said to me."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Sounds like there\'s a story there."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Everybody loses sometimes, Blaze."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*freezes* ...Real? I don't do real. Real is a vulnerability. Real gets you-- *stops himself* See, this is why I don't talk to people. Forget it. Seriously.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "A story? Yeah, there's a story. But it's not the kind you tell on day four of a dating show. Maybe some other time. Maybe never.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*snaps* Yeah, everybody loses. But not everybody grew up where losing meant going hungry. So spare me the motivational speech.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "*turns away* ...Sorry. I don't usually do... that. Whatever that was. Just pretend it didn't happen.",
    },
  },
};

const blaze_d4_mid: DialogueScript = {
  id: 'blaze_d4_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*staring at the ocean, doesn't notice you at first* Oh. Hey. I was just... thinking. Yeah, I know. Shocking. Blaze has thoughts beyond winning.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "You ever put on a face for so long that you forget what your real one looks like? I caught my reflection earlier and I was doing this *gestures at his cocky grin* and I just thought... who even IS that?",
      choices: [
        {
          text: '"I think I just caught a glimpse of the real one. And honestly? I like him better."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"That sounds like progress. Questioning the mask is the first step to taking it off."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Maybe the mask is who you are now. People change."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*stares at you, genuinely stunned* ...You like this? *gestures at himself, vulnerable* This confused fox who's scared he's only good at pretending? You're weird. But in a way that makes my chest do something strange.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Taking it off. Man, that sounds terrifying. What if there's nothing underneath? What if the mask is the only interesting part? ...Sorry. That got darker than I meant it to.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*tail droops slightly* Maybe. Maybe the mask won. Maybe the scrappy kit from the bad den is gone and all that's left is this. *gestures at himself* The brand.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "*shakes it off, puts the grin back on* Alright, deep moment over. Tell anyone about this and I'll deny everything. But also... thanks. For not walking away.",
    },
  },
};

const blaze_d4_high: DialogueScript = {
  id: 'blaze_d4_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*catches your arm gently* Wait. Before we go back to the group, I need to say something, and I'm only going to be able to say it once.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Blaze',
      text: "This whole cocky-fox thing I do? It started as survival. If you act like nothing can hurt you, eventually people believe it. Problem is, I started believing it too.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "*voice drops* But around you, the act keeps slipping. And that scares me more than anything on this island. Because if the act slips, then you'll see that I'm just... a fox who's really, really scared of not being enough.",
      choices: [
        {
          text: '"You\'re more than enough. And the fact that you\'re scared just means you care about something real for once."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"Being scared means you\'re being honest. That takes more guts than any challenge."',
          next: 'friendly',
          effects: { relationship_level: 7 },
        },
        {
          text: '"I appreciate you telling me that."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*jaw clenches, fighting emotion* More than enough. Nobody has ever... in the den, you were either useful or you were nothing. 'Enough' wasn't even a concept. And here you are just handing it to me like it's obvious.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*laughs shakily* More guts than the challenges? Buddy, I've fought off foxes twice my size and THAT felt easier than this conversation. But you're right. This is the real arena.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "Appreciate it. Right. *tries to play it off but his ears are flat* That's more than I expected, honestly. Most people don't even get this far past the wall.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "*straightens up, but softer than before* Okay. That happened. And I'm not taking it back. But if you tell anyone I went soft, I will absolutely challenge you to a rematch of everything.",
    },
  },
};

// ============================================================
// DAY 5 - Reveals where his drive comes from (tough upbringing)
// ============================================================

const blaze_d5_low: DialogueScript = {
  id: 'blaze_d5_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "You want to know why I'm like this? Why everything's a competition? Fine. I'll tell you.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "I grew up in the roughest den on the wrong side of the forest. Seven kits, not enough food. You learned to fight for your share or you didn't eat. That was just Tuesday.",
      choices: [
        {
          text: '"You shouldn\'t have had to fight just to eat. That wasn\'t your fault."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"That explains a lot about how you operate."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Rough start, but you\'re not there anymore."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*long pause* ...Wasn't my fault. Huh. I've never once thought about it that way. I always thought I needed to be tougher. Never occurred to me that I shouldn't have needed to be.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Explains a lot. Yeah. When every meal is a competition, eventually everything is. It's hard to unlearn that even when the fridge is full.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "Not there anymore? Physically, sure. But up here? *taps his temple* I'm still that hungry kit every single day. That doesn't just go away because the scenery changes.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Anyway. Now you know. Don't feel sorry for me -- I turned out incredible. *smirks, but it doesn't quite reach his eyes*",
    },
  },
};

const blaze_d5_mid: DialogueScript = {
  id: 'blaze_d5_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*sits down next to you, quieter than usual* Can I tell you something I've never told anyone on this island? Actually, something I've never told almost anyone?",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Blaze',
      text: "My den growing up? Worst in the forest. And I don't mean 'rustic' -- I mean dangerous. I learned charm because charm opened doors that my claws couldn't. Every smile I have was sharpened as a tool.",
      choices: [
        {
          text: '"A tool can become something more. Your charm is real now -- I can tell the difference."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"You built yourself up from nothing. That takes serious strength."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Is that what you\'re doing with me? Using charm as a tool?"',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*ears twitch* You can tell the difference? Between the tool and the real thing? ...I'm not sure I always can anymore. But if you can see it, maybe it's there.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Strength. *quiet laugh* That's what I call it too. Sounds better than 'desperation,' right? But yeah. I built something. Whether it's the right thing... jury's still out.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*flinches visibly* ...No. That's what I'm trying to tell you. With you, it doesn't feel like a tool. And that's what's freaking me out. I don't have a playbook for genuine.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "I showed you the underside of the armor today. Don't make me regret it. ...And don't look at me like that. I'm fine. I'm always fine.",
    },
  },
};

const blaze_d5_high: DialogueScript = {
  id: 'blaze_d5_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*takes you somewhere private, looking more serious than you've ever seen him* I owe you the truth. The full version. Not the highlight reel.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Blaze',
      text: "I was the runt. Seven kits and I was the smallest. My den was the kind of place where the strongest ate first and the weakest got whatever was left. So I got clever. I learned to talk my way into meals, into safety, into survival.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "*voice rough* I came to this island because I thought I could win it like I won everything else -- with strategy and swagger. But you made me realize I want something I can't win. I want someone to choose me because I'm worth choosing. Not because I tricked them into it.",
      choices: [
        {
          text: '"You don\'t need tricks. I chose you a long time ago. The real you."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"The fact that you want to be chosen for real? That means you already are more than the tricks."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That\'s a big realization. What are you going to do with it?"',
          next: 'cold',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*completely still. Then his voice cracks* Chose me? The runt from the bad den who learned to smile so people wouldn't see him starving? You chose THAT fox?",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*swallows hard* More than the tricks. I want to be. I'm trying to be. It's like learning to walk again after running your whole life. But I'm trying.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "What am I going to do with it? *runs a paw through his fur* Honestly? I have no idea. All my plans are based on the old playbook. This... this is uncharted territory.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "*exhales shakily* That's it. Everything. The runt, the den, the act. Now you know the fox behind the fire. And I have no idea what happens next.",
    },
  },
};

// ============================================================
// DAY 6 - Admits being liked matters more than winning, vulnerability
// ============================================================

const blaze_d6_low: DialogueScript = {
  id: 'blaze_d6_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "So the ceremony is tomorrow. And I am absolutely, completely fine with however it goes. ...That's a lie. I'm not fine at all.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "I keep telling myself it's about winning. But winning what? A trophy? A title? What I actually want is... I want people to like me. Not the act. Me. And that's the most terrifying thing I've ever admitted.",
      choices: [
        {
          text: '"The fact that you can say that out loud means you\'re already braver than the act ever was."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Wanting to be liked isn\'t weakness, Blaze."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"That is pretty scary to admit."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*blinks rapidly* Braver than the act. ...You keep saying things that knock the wind out of me. I don't know what to do with that.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Not weakness. Yeah, my brain knows that. But the kit inside me who learned that needing people gets you hurt? He's not convinced yet.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "Scary. Yeah. I've faced down foxes twice my size and THIS is what gets my heart racing. How messed up is that?",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Anyway. Forget I had feelings for a minute there. Normal programming will resume shortly.",
    },
  },
};

const blaze_d6_mid: DialogueScript = {
  id: 'blaze_d6_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*pacing* Okay. Okay okay okay. Tomorrow is the ceremony and I need to talk to someone or I'm going to lose it. You're the only one I trust enough for this.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Blaze',
      text: "I've spent this whole week acting like I don't care. Like winning is everything and connections are just strategy. But you know what keeps me up at night? Not whether I WIN. Whether anyone here will actually miss me if I go.",
      choices: [
        {
          text: '"I would miss you. Not the act, not the swagger -- you. And that\'s not strategy."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"You\'ve made real connections here, Blaze. More than you think."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"I think people see more of you than you realize."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*stops pacing. Voice barely above a whisper* You'd miss me. Not the brand. Me. I've wanted to hear something like that my whole life and I never even knew it until right now.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Real connections. *sits down heavily* You really think so? Because from where I'm standing, it feels like everyone likes Blaze the character. I don't know if anyone likes Blaze the fox.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "See more than I realize? Man, I hope you're right. Because I've been running this act so long I'm not sure what's real and what's performance anymore.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "If I get through tomorrow, it won't be because of strategy. It'll be because someone on this island saw something worth keeping. And right now? You're the only one making me believe that's possible.",
    },
  },
};

const blaze_d6_high: DialogueScript = {
  id: 'blaze_d6_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*finds you, hands shaking slightly* I can't do the thing tonight. The cocky thing. I tried and it just... won't come. I think you broke my armor and I don't know how to function without it.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Blaze',
      text: "My whole life, being liked was a strategy. Get them to like you so they help you. Get them to respect you so they don't hurt you. But with you it's different. I don't want you to like me because it's useful. I want you to like me because...",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "*voice breaking* ...because for the first time, someone actually knowing me and STILL choosing to be here would mean that maybe the kit from the bad den was worth something all along.",
      choices: [
        {
          text: '"He was always worth something. And I\'m going to keep showing up until you believe that."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You are worth something. The den doesn\'t get to define that. You do."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That\'s really heavy, Blaze. But I hear you."',
          next: 'cold',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*tears he'd never admit to* Keep showing up. That's all I ever wanted. Just someone who stays. Not because I'm useful or charming or winning, but because... they just stay.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*takes a shaky breath* I define it? ...That's the scariest thing you could have said. Because it means the only thing standing between me and being enough is... me letting it be true.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "You hear me. *nods slowly* That's something. I've been shouting my whole life and this is the first time I feel like someone actually heard. Even if you can't say more, that's... that's enough right now.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "*wipes his eyes quickly* Right. Okay. That was the most un-Blaze thing I've ever done. But it was the most ME thing I've done in years. And it's because of you.",
    },
  },
};

// ============================================================
// DAY 7 - Pre-ceremony nerves, acknowledges real bonds
// ============================================================

const blaze_d7_low: DialogueScript = {
  id: 'blaze_d7_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "Last day. *cracks knuckles* End of the line. Whatever happens at the ceremony, I played this island my way.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "Look, I know I wasn't the easiest fox to deal with this week. I came in hot and I stayed hot. But... I don't entirely regret it. Mostly.",
      choices: [
        {
          text: '"Mostly. I\'ll take it. That might be the closest thing to an apology you\'ve ever given."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"You were yourself. That counts for something."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"It was definitely an experience."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*half-smiles* An apology? Don't push your luck. But yeah... if I could do this week over, I might've spent less time competing and more time... I don't know. Talking. Like this.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "Myself. Right. I'm still figuring out which version of myself is the real one. But this week helped. Even if I won't admit how much.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "An experience. *dry laugh* Yeah, that's one word for it. Well, at least I was memorable. Nobody's going to forget this fox.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Good luck tonight. Seriously. And hey -- keep up or step aside. ...Nah. Actually, just keep up. I'd rather have you beside me than behind.",
    },
  },
};

const blaze_d7_mid: DialogueScript = {
  id: 'blaze_d7_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*finds you before the ceremony* Alright. Before tonight changes everything, I need to get something off my chest. And yes, I can hear how dramatic that sounds. I don't care.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "This week, I came in thinking I had it all figured out. Compete hard, look good, win. But somewhere around day three you scrambled my whole playbook. And now I'm standing here with no strategy at all. Just... nerves.",
      choices: [
        {
          text: '"Nerves mean you care. And caring is the bravest thing the fox from the bad den has ever done."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"For what it\'s worth, watching you drop the playbook was the highlight of my week."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Nerves look good on you, honestly."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*jaw tight, fighting a real smile* The bravest thing. You really see it that way? Because from the inside it feels like the dumbest thing. But if you say it's brave... maybe I can believe that.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "The highlight? *exhales a laugh* I spent my whole life building that playbook and you're telling me the best part was watching me throw it away. That's either beautiful or messed up. Maybe both.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "*rubs the back of his neck* Look good on me? Funny. Everything else I've worn this week was calculated. The nerves are the first thing that's honest. So thanks for noticing.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Whatever happens at the ceremony -- I want you to know that you made this week mean something beyond winning. And that's a sentence the old Blaze would never have said.",
    },
  },
};

const blaze_d7_high: DialogueScript = {
  id: 'blaze_d7_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Blaze',
      text: "*grabs your hands, tail low, completely stripped of swagger* Okay. No performance. No lines. No strategy. Just me.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Blaze',
      text: "A week ago I walked onto this island thinking I was going to dominate it. Win every challenge, charm every person, leave with a trophy. And instead I'm standing here terrified because the only prize I care about is you not leaving.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Blaze',
      text: "*voice raw* You saw every version of me. The cocky one, the strategic one, the scared kid from the den. And you stayed through all of it. I need you to know -- that's the most anyone has ever given me. Ever.",
      choices: [
        {
          text: '"I\'m not leaving. Not tonight, not after. You\'re stuck with someone who sees all of you and chooses every part."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You made it easy to stay. The real you -- he\'s someone worth standing beside."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"This week changed me too. More than I expected."',
          next: 'cold',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Blaze',
      text: "*pulls you close, voice cracking* Every part. Even the runt? Even the one who used to steal bread and sleep in cold dirt? You'd choose THAT fox? ...Because that fox never thought he'd hear those words.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Blaze',
      text: "*eyes shining* Worth standing beside. The kid in the den used to dream about that. Having someone stand beside him instead of above him. And here you are.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Blaze',
      text: "Changed you? *small, real smile* Then I guess we changed each other. I came here to win a game and instead I found something that makes winning seem small.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Blaze',
      text: "Tonight at the ceremony, everyone's going to see the swagger come back. But you'll know the truth -- underneath all of it, there's just a fox who finally found someone worth being real for.",
    },
  },
};

export const BLAZE_DAILY: DialogueScript[][] = [
  [blaze_d1_low, blaze_d1_mid, blaze_d1_high],
  [blaze_d2_low, blaze_d2_mid, blaze_d2_high],
  [blaze_d3_low, blaze_d3_mid, blaze_d3_high],
  [blaze_d4_low, blaze_d4_mid, blaze_d4_high],
  [blaze_d5_low, blaze_d5_mid, blaze_d5_high],
  [blaze_d6_low, blaze_d6_mid, blaze_d6_high],
  [blaze_d7_low, blaze_d7_mid, blaze_d7_high],
];

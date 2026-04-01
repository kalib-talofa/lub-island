import type { DialogueScript } from '@/utils/ink';

// ──────────────────────────────────────────────
// Day 1 — Joke-heavy introduction, trying too hard
// ──────────────────────────────────────────────

const sprocket_d1_low: DialogueScript = {
  id: 'sprocket_d1_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Hey hey HEY! What do you call a penguin in the tropics? LOST! Ha! ...Get it? Because I'm a penguin? On a tropical island?",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "Okay okay, I've got a million more where that came from. Wanna hear another one?",
      choices: [
        {
          text: '"Hit me with your best shot."',
          condition: (v) => v.charm >= 30,
          lockMessage: 'Needs 30 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Sure, why not."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"I think I\'m good."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "FINALLY someone with TASTE! Okay: Why don't penguins like talking to strangers? ...They find it hard to break the ice! *finger guns*",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "Okay! Why did the penguin cross the road? To prove he wasn't chicken! ...Wait, is that offensive to chickens?",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Sprocket',
      text: "Oh. Yeah. Cool cool cool. That's... that's fine. I'll just, uh, workshop some new material. Alone. On this rock. *nervous laugh*",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Anyway, catch you later! I'll be here all week! ...Literally, I can't leave. It's an island.",
    },
  },
};

const sprocket_d1_mid: DialogueScript = {
  id: 'sprocket_d1_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Hey! You're back! Okay so I've been working on some new material. Ready? What's a penguin's favourite relative? Aunt Arctica! *ba-dum-tss*",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "C'mon, that one was solid. Be honest with me — am I funny or am I FUNNY?",
      choices: [
        {
          text: '"You actually got a real laugh out of me."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"You\'re definitely... something."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Honestly? The jokes are a lot."',
          next: 'blunt',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Wait, a REAL laugh? Not a pity laugh? You're not messing with me? ...That actually means a lot. Don't tell anyone I said that.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "I'll take 'something!' 'Something' is a step above 'please stop talking,' which is what I usually get!",
      next: 'end',
    },
    blunt: {
      id: 'blunt',
      speaker: 'Sprocket',
      text: "A lot? Like... a LOT a lot? Or just, y'know, a medium amount? ...Okay yeah I hear it. I'm doing the thing again, aren't I.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Alright, I gotta go prep. Tonight's open mic is gonna be LEGENDARY. Or at least... not terrible. We'll see!",
    },
  },
};

const sprocket_d1_high: DialogueScript = {
  id: 'sprocket_d1_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Oh hey, it's YOU! Okay okay okay — I've been saving my best stuff for someone who actually appreciates comedy. Ready?",
      next: 'setup',
    },
    setup: {
      id: 'setup',
      speaker: 'Sprocket',
      text: "Why did the penguin bring a ladder to the villa? ...Because he wanted to reach new HEIGHTS in his love life! Eh? EHHH?",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "Okay but real talk for like half a second — it's kinda wild being here, right? Like... a whole island just for meeting people?",
      choices: [
        {
          text: '"It\'s pretty amazing. I\'m glad you\'re here."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"Yeah, it feels surreal."',
          next: 'friendly',
          effects: { relationship_level: 7 },
        },
        {
          text: '"I try not to overthink it."',
          next: 'casual',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "You... you're glad I'm here? *blinks* Nobody's ever — I mean, psssh, OBVIOUSLY you are, I'm HILARIOUS. But also... thanks. For real.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "Right?! Like someone pinch me. Actually don't, I bruise easy. Penguin skin, very delicate. That's definitely a real fact.",
      next: 'end',
    },
    casual: {
      id: 'casual',
      speaker: 'Sprocket',
      text: "Smart, smart. Meanwhile my brain is going a hundred miles an hour at all times. Hence the jokes. They're like... pressure valves? Is that weird?",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Okay moment's over! Back to regularly scheduled programming! ...If you're not laughing, I'm not trying hard enough!",
    },
  },
};

// ──────────────────────────────────────────────
// Day 2 — Shows off a silly talent, eager to impress
// ──────────────────────────────────────────────

const sprocket_d2_low: DialogueScript = {
  id: 'sprocket_d2_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "BEHOLD! *balances a coconut on his beak* Pretty impressive, right? I've been practicing all morning!",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "I can also juggle! Well, I can juggle ONE thing. Which is technically just... throwing. BUT STILL!",
      choices: [
        {
          text: '"That\'s actually really impressive balance."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Heh, not bad."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Why, though?"',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Impressive?! You said impressive! I'm adding that to my highlight reel! *coconut falls off* ...We'll edit that part out.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "Not bad?! I'll TAKE not bad! Last person said 'please stop doing that near the pool.' So we're trending up!",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Sprocket',
      text: "Why? BECAUSE! Because... uh... okay I don't have a good reason. I just thought you'd think it was cool. *quietly sets coconut down*",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Stick around — I'm workshopping a thing where I slide on my belly into the pool. It's gonna be HUGE. Or a disaster. Probably both!",
    },
  },
};

const sprocket_d2_mid: DialogueScript = {
  id: 'sprocket_d2_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Okay okay OKAY — check THIS out! *does an elaborate belly slide across the deck* WHOOOOSH! Nailed it! ...mostly!",
      next: 'react',
    },
    react: {
      id: 'react',
      speaker: 'Sprocket',
      text: "I used to do that on the ice back home. Everybody loved it! Well... 'loved' might be strong. They noticed me, which is basically the same thing!",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "Wanna see the grand finale? I call it 'The Sprocket Spin Spectacular!'",
      choices: [
        {
          text: '"Absolutely! Show me everything."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"Go for it."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Maybe take it easy before you hurt yourself."',
          next: 'concerned',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "EVERYTHING?! Nobody's ever asked for the full show! *spins, wobbles, nearly falls* TADAAAA! ...You're the best audience I've ever had. And I mean that.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "*spins dramatically* BOOM! The Sprocket Spin! Patent pending! I'm telling you, this is gonna be my thing here!",
      next: 'end',
    },
    concerned: {
      id: 'concerned',
      speaker: 'Sprocket',
      text: "Hurt myself? Pffft, I'm a professional! *immediately stubs flipper* OW! ...I'm fine, I'm fine! That was part of the act!",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Phew! What a rush! I'm gonna go ice this bruise — I mean, plan my next performance! See ya!",
    },
  },
};

const sprocket_d2_high: DialogueScript = {
  id: 'sprocket_d2_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Okay, so I've been working on something special. Not my usual goofy stuff — this is the REAL talent. *clears throat* Watch!",
      next: 'perform',
    },
    perform: {
      id: 'perform',
      speaker: 'Sprocket',
      text: "*does an incredible belly slide, spins, and lands perfectly balanced on one foot* ...I actually practiced that for hours. Like, genuinely hours.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "I dunno why but... I really wanted to impress you specifically. Is that weird? That's probably weird. Joke incoming to cover this up in three, two—",
      choices: [
        {
          text: '"Don\'t. You don\'t need a joke right now. That was amazing."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 11 },
        },
        {
          text: '"It\'s not weird. You\'re really talented."',
          next: 'warm',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Go ahead and hit me with the joke."',
          next: 'deflect',
          effects: { relationship_level: 6 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "I... okay. No joke. Just... thanks. *shuffles feet* I don't usually let people see me actually try at something. It's easier to just be the funny guy.",
      next: 'end',
    },
    warm: {
      id: 'warm',
      speaker: 'Sprocket',
      text: "Talented? Me? I mean — YES, obviously, incredible talent over here! But also... that hit different coming from you. In a good way.",
      next: 'end',
    },
    deflect: {
      id: 'deflect',
      speaker: 'Sprocket',
      text: "Ha! Okay: What do you call a penguin who can do backflips? ...ME! Eventually! Once the doctors clear me! *laughs* ...but thanks for watching.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "I'm gonna ride this high for the rest of the day. Sprocket: comedian, athlete, and apparently someone who has feelings. Who knew!",
    },
  },
};

// ──────────────────────────────────────────────
// Day 3 — A joke falls flat, genuine awkwardness
// ──────────────────────────────────────────────

const sprocket_d3_low: DialogueScript = {
  id: 'sprocket_d3_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Okay so I told this joke at breakfast and NOBODY laughed. Like, zero people. Zilch. Nada. The silence was so loud I could hear the ocean judging me.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "It was a good joke too! At least... I thought it was? Maybe I'm losing my touch. Ha ha... ha.",
      choices: [
        {
          text: '"Tell me the joke. I\'ll give you an honest take."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Everyone has off days."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Maybe try a different approach?"',
          next: 'blunt',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "An honest take? Okay... *tells joke* ...See? Funny, right? ...You're not laughing either. BUT at least you asked! That counts for something!",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "Off days. Right. Sure. Just an off day. Not an off personality! *laughs nervously* I'm fine! Everything's fine!",
      next: 'end',
    },
    blunt: {
      id: 'blunt',
      speaker: 'Sprocket',
      text: "A different — what would I even DO if I'm not doing jokes? Just... stand there? Being a regular penguin? *shudders* That's terrifying honestly.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Anyway! Back to the drawing board! New jokes, better jokes, UNSTOPPABLE jokes! ...Right after I go sit by myself for a minute. For... research.",
    },
  },
};

const sprocket_d3_mid: DialogueScript = {
  id: 'sprocket_d3_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "So... funny thing. Not like ha-ha funny. More like oof funny. I bombed in front of everyone at the firepit last night.",
      next: 'explain',
    },
    explain: {
      id: 'explain',
      speaker: 'Sprocket',
      text: "Dead silence. Then someone changed the subject. And I just stood there with my flippers out like... *mimics frozen pose* ...Yeah.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "I keep replaying it in my head. I know it's dumb but — what if they all just think I'm annoying?",
      choices: [
        {
          text: '"Being vulnerable about this takes guts. I respect that."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Nobody thinks you\'re annoying, Sprocket."',
          next: 'reassure',
          effects: { relationship_level: 6 },
        },
        {
          text: '"I mean... you do tell a LOT of jokes."',
          next: 'honest',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Guts? I — *pauses* ...I don't usually let people see the not-funny parts. You're weirdly easy to talk to. Like, suspiciously easy.",
      next: 'end',
    },
    reassure: {
      id: 'reassure',
      speaker: 'Sprocket',
      text: "You sure? Because I've been 'a lot' for people my whole life. That's kinda my thing — too much Sprocket, not enough chill.",
      next: 'end',
    },
    honest: {
      id: 'honest',
      speaker: 'Sprocket',
      text: "...Yeah. I do. I really do. *quiet for a moment* I just don't know what else to be, you know?",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Okay okay, enough with the feelings stuff. I appreciate you listening though. Seriously. Now if you'll excuse me, I need to go stare at the ocean and pretend I'm in a music video.",
    },
  },
};

const sprocket_d3_high: DialogueScript = {
  id: 'sprocket_d3_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Hey... can I tell you something? Like, actually tell you. No punchline at the end. I promise.",
      next: 'vulnerable',
    },
    vulnerable: {
      id: 'vulnerable',
      speaker: 'Sprocket',
      text: "I told a joke at the firepit and nobody laughed. Which happens, whatever. But then I couldn't stop thinking — what if the jokes are the ONLY reason people talk to me?",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "Like... if I stopped being funny... would anyone still want me around?",
      choices: [
        {
          text: '"I would. The real you is someone worth knowing."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"Your jokes aren\'t why I like hanging out with you."',
          next: 'warm',
          effects: { relationship_level: 9 },
        },
        {
          text: '"That\'s a hard question. But you\'re more than just jokes."',
          next: 'thoughtful',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "...Okay I'm gonna need you to stop being so nice because my eyes are doing a thing and penguins are NOT supposed to cry in the tropics. It's in the handbook.",
      next: 'end',
    },
    warm: {
      id: 'warm',
      speaker: 'Sprocket',
      text: "They're... they're not? Then why do you — *voice cracks* Sorry, sorry. It's just... nobody's said that to me before. Like, ever.",
      next: 'end',
    },
    thoughtful: {
      id: 'thoughtful',
      speaker: 'Sprocket',
      text: "More than just jokes. *lets that sink in* I wanna believe that. I'm trying to believe that. Maybe with a little practice I can, right?",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Okay. Deep breath. *exhales* Thank you. I really mean it. Now let me go process this somewhere before I turn into a puddle.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 4 — Admits he doesn't know who he is without the jokes
// ──────────────────────────────────────────────

const sprocket_d4_low: DialogueScript = {
  id: 'sprocket_d4_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "So I tried being 'chill' for a whole hour today. No jokes. Just... standing around. Do you know how HARD that is?!",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "I lasted twelve minutes. Then I told a knock-knock joke to a coconut. The coconut did not respond. Still a better audience than breakfast yesterday.",
      choices: [
        {
          text: '"What made you want to try being chill?"',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Twelve minutes is a start."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Maybe just be yourself?"',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "I dunno... I just started wondering what I'd be like without all the noise. Turns out the answer is 'a very anxious penguin standing near a coconut.' So... progress?",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "A start! Yeah! Twelve minutes of personal growth! I'll add another minute tomorrow! By day seven I'll be a whole new bird! *nervous laugh*",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Sprocket',
      text: "Myself? Ha! That's the million-dollar question, isn't it? Which self? Joke Sprocket? Quiet Sprocket? I don't even know which one's real anymore.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Anyway! Enough existential crisis for one afternoon! ...Did the coconut thing make you laugh at least? Even a little? No? Cool cool cool.",
    },
  },
};

const sprocket_d4_mid: DialogueScript = {
  id: 'sprocket_d4_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Can I ask you something weird? And like, don't make it a big deal. Because it's not a big deal. Except it kind of is.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Sprocket',
      text: "...Do you think there's a version of me that's not just 'the funny guy'? Like, if you took away all the jokes... is there anything LEFT?",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "Because honestly? I have no idea. I've been doing this act so long I can't tell where it ends and I begin.",
      choices: [
        {
          text: '"The fact that you\'re asking that question means there\'s something real underneath."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Of course there is. The jokes are just one part of you."',
          next: 'kind',
          effects: { relationship_level: 6 },
        },
        {
          text: '"I think you should figure that out."',
          next: 'direct',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "...Huh. I never thought of it like that. If I'm asking the question, then the person asking is someone who ISN'T just jokes. That's... actually kind of deep? Am I deep now?!",
      next: 'end',
    },
    kind: {
      id: 'kind',
      speaker: 'Sprocket',
      text: "One part? You really think so? Because from where I'm standing, it feels like it's the whole thing. But maybe... maybe you're seeing something I can't.",
      next: 'end',
    },
    direct: {
      id: 'direct',
      speaker: 'Sprocket',
      text: "Figure it out. Yeah. That sounds easy. Just figure out your entire identity on a reality dating show. No big deal! *nervous laugh* ...But you're right.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Thanks for not making it weird. Or weirder. You're good at that — the whole 'listening' thing. I'm... not used to it.",
    },
  },
};

const sprocket_d4_high: DialogueScript = {
  id: 'sprocket_d4_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "I've been thinking. Like, actually thinking. Not 'thinking of jokes' thinking. Real thinking. Which is new and honestly kind of scary.",
      next: 'open_up',
    },
    open_up: {
      id: 'open_up',
      speaker: 'Sprocket',
      text: "I don't know who I am without the act. Every conversation, every moment — I'm already writing the punchline in my head before someone finishes talking. I don't know how to just... be present.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "But with you it's different. I keep catching myself about to make a joke and then thinking... maybe I don't need to? Maybe it's okay to just talk?",
      choices: [
        {
          text: '"It\'s more than okay. This is the version of you I want to know."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You\'re doing it right now. Just being real. And it\'s great."',
          next: 'warm',
          effects: { relationship_level: 9 },
        },
        {
          text: '"Take your time. There\'s no rush to figure it all out."',
          next: 'gentle',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "The version of me you want to know. *long pause* ...I didn't have a joke ready for that. And for once, I don't want one. I just want to sit here with that feeling for a second.",
      next: 'end',
    },
    warm: {
      id: 'warm',
      speaker: 'Sprocket',
      text: "I'm doing it right now? Like... this counts? Just talking without being performative? *exhales* Okay. Yeah. This is... nice. Really nice.",
      next: 'end',
    },
    gentle: {
      id: 'gentle',
      speaker: 'Sprocket',
      text: "No rush. Right. *steadies breathing* I spent my whole life rushing to the next punchline. The idea of slowing down is... honestly terrifying. But the good kind? If that exists?",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "I think you might be the first person who makes me feel like I'm enough without the act. And that's not a setup. There's no punchline. Just... that.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 5 — Opens up about not fitting in back home
// ──────────────────────────────────────────────

const sprocket_d5_low: DialogueScript = {
  id: 'sprocket_d5_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Fun fact! Did you know penguin colonies can have thousands of birds? Thousands! And somehow I was STILL the weird one! *forced laugh*",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "Everyone else was all 'huddle for warmth' and 'march in a line' and I was like 'WHAT IF WE DID IMPROV COMEDY?!' ...They were not into it.",
      choices: [
        {
          text: '"Sounds like you were just ahead of your time."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Their loss."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"I mean, improv IS a hard sell."',
          next: 'blunt',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Ahead of my time! Ha! I'm gonna use that. 'Not rejected — just chronologically displaced!' ...But actually, thanks for saying that.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "Their loss! Exactly! A colony of THOUSANDS and not one of them could handle a little penguin with big comedy dreams!",
      next: 'end',
    },
    blunt: {
      id: 'blunt',
      speaker: 'Sprocket',
      text: "A hard sell? Yeah, okay, FAIR. But in my defense, 'The Aristocrats' kills in ANY species. ...Okay it doesn't. But I maintain it SHOULD.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Anyway, ancient history! The point is I'm HERE now, on this island, with a MUCH better audience! ...You ARE a better audience, right? Please say yes.",
    },
  },
};

const sprocket_d5_mid: DialogueScript = {
  id: 'sprocket_d5_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "You wanna know something I don't usually talk about? Back in the colony... I never really fit in. And not in the cool outsider way.",
      next: 'backstory',
    },
    backstory: {
      id: 'backstory',
      speaker: 'Sprocket',
      text: "Penguins are all about the group, right? Huddling together, moving as one? But I was always the chick making noise when everyone else was quiet. The loud one. The disruptive one.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "So I figured — if they're gonna notice me anyway, might as well make them laugh. At least then the attention feels intentional, you know?",
      choices: [
        {
          text: '"That takes a lot of courage, turning pain into something positive."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"I get it. Better to be laughed with than at."',
          next: 'understanding',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Do you miss the colony?"',
          next: 'redirect',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Courage? I... *stops* Nobody ever called it courage before. Usually it's 'overcompensating' or 'being too much.' Courage sounds way better.",
      next: 'end',
    },
    understanding: {
      id: 'understanding',
      speaker: 'Sprocket',
      text: "Exactly. EXACTLY. Laughed with, not at. That's the whole game. And most of the time I can keep it going. It's just... tiring sometimes.",
      next: 'end',
    },
    redirect: {
      id: 'redirect',
      speaker: 'Sprocket',
      text: "Miss it? I... sometimes. I miss having a group, even if I was on the edges of it. Being the outsider who's still technically inside is weird.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Wow, I just unloaded a LOT of penguin trauma on you. My bad. But also... thanks for sticking around for it. That means more than any laugh.",
    },
  },
};

const sprocket_d5_high: DialogueScript = {
  id: 'sprocket_d5_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "I want to tell you something real. About home. About why I'm actually here.",
      next: 'deep',
    },
    deep: {
      id: 'deep',
      speaker: 'Sprocket',
      text: "In the colony, I was the loudest chick. Always cracking jokes, doing bits, anything to get a reaction. But it wasn't because I was happy. It was because silence terrified me.",
      next: 'deeper',
    },
    deeper: {
      id: 'deeper',
      speaker: 'Sprocket',
      text: "Because in the silence, I had to hear what I actually thought about myself. And what I thought was... that nobody would choose to be around me if I stopped performing.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "I came here because I thought maybe — somewhere new, with new people — I could figure out if there's someone worth knowing underneath all the noise.",
      choices: [
        {
          text: '"There is. I\'ve seen him. And he\'s braver than any joke."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"The fact that you\'re telling me this IS the proof, Sprocket."',
          next: 'affirm',
          effects: { relationship_level: 9 },
        },
        {
          text: '"I think you\'re already finding him."',
          next: 'encourage',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "...*long silence* ...I don't have a joke for that. And that might be the most honest thing I've ever experienced. Just... standing here. With nothing to say. And it's okay.",
      next: 'end',
    },
    affirm: {
      id: 'affirm',
      speaker: 'Sprocket',
      text: "The proof? *voice cracks* I've never talked about this with anyone. Not a single penguin in that colony knows this about me. But you do now. And I'm glad.",
      next: 'end',
    },
    encourage: {
      id: 'encourage',
      speaker: 'Sprocket',
      text: "Already finding him. *inhales shakily* Maybe. Maybe because someone finally made it safe enough to look. That someone is you, by the way. In case that was unclear.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Thank you. Not for laughing at my jokes — for being the first person who made me feel like I didn't need them.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 6 — Genuine bravery, does something real
// ──────────────────────────────────────────────

const sprocket_d6_low: DialogueScript = {
  id: 'sprocket_d6_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Okay so... I did a thing. At the group hangout. I said something genuine. Like, no joke attached. Just a real thought. Out loud. To PEOPLE.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "I told everyone the sunset was beautiful. That's IT. No punchline. And you know what? Nobody looked at me weird. Wild, right?",
      choices: [
        {
          text: '"That\'s a big deal. I\'m proud of you."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"See? People like the real you."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Baby steps."',
          next: 'minimal',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Proud of me? For saying a sunset is pretty? *laughs* ...Okay, when you put it that way it sounds small. But for me? It was kinda huge.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "The real me! Bold concept! Sprocket 2.0! Now with genuine emotional responses! Limited edition!",
      next: 'end',
    },
    minimal: {
      id: 'minimal',
      speaker: 'Sprocket',
      text: "Baby steps! Exactly! Today: sunsets are pretty. Tomorrow: maybe I'll admit I have feelings about other things! The DAY after that: full emotional breakdown! Progress!",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "I'm calling it a win. Small win. But mine. Catch you later!",
    },
  },
};

const sprocket_d6_mid: DialogueScript = {
  id: 'sprocket_d6_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "I did something today that scared me more than anything I've done on this island.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Sprocket',
      text: "I sat with someone at the firepit and just... listened. I didn't perform. Didn't riff. Just sat there and was present. For like twenty whole minutes.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "And the terrifying part? It felt... good? Like, really good? Is this what normal people feel all the time?",
      choices: [
        {
          text: '"That\'s what real connection feels like."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Twenty minutes! That\'s real progress."',
          next: 'encouraging',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Was it hard to not fill the silence?"',
          next: 'curious',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Real connection. *lets out a slow breath* Is THAT what I've been running from this whole time? Just... being present with someone? I'm such a dork.",
      next: 'end',
    },
    encouraging: {
      id: 'encouraging',
      speaker: 'Sprocket',
      text: "Right?! Up from twelve minutes of staring at a coconut! I'm on an exponential growth curve here!",
      next: 'end',
    },
    curious: {
      id: 'curious',
      speaker: 'Sprocket',
      text: "SO hard. My brain was screaming at me the entire time. 'Say something funny! Quick! They'll get bored!' But they didn't. They just... kept talking to me. Regular talking.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "I think I'm starting to figure out that being brave doesn't always mean being loud. Sometimes it means being quiet and staying anyway.",
    },
  },
};

const sprocket_d6_high: DialogueScript = {
  id: 'sprocket_d6_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "I need to tell you something and I'm going to do it without a single joke. Timer starts now.",
      next: 'brave',
    },
    brave: {
      id: 'brave',
      speaker: 'Sprocket',
      text: "You've changed me. Not in a cheesy makeover way. In a... 'I finally believe I'm worth knowing' way. Because you kept showing up even when I was just noise.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "I stood up at the group dinner tonight and I thanked everyone. No bit. No punchline. I just said... that I'm grateful. And I meant every word.",
      choices: [
        {
          text: '"That\'s the bravest thing I\'ve ever seen you do."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"I\'m so proud of you, Sprocket."',
          next: 'warm',
          effects: { relationship_level: 9 },
        },
        {
          text: '"How did it feel?"',
          next: 'reflective',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Bravest thing? *tears up* Okay, the no-joke timer is getting really hard right now because there are EMOTIONS happening and I have no defense mechanisms and—...yeah. It was brave. It was really, really brave.",
      next: 'end',
    },
    warm: {
      id: 'warm',
      speaker: 'Sprocket',
      text: "Proud of me. *sniffs* You know, I don't think anyone back home ever said that to me? They laughed at my jokes but nobody ever said they were proud of who I am.",
      next: 'end',
    },
    reflective: {
      id: 'reflective',
      speaker: 'Sprocket',
      text: "It felt like jumping off a cliff and finding out I could fly. Or at least waddle through the air really gracefully. *small genuine laugh* It felt like being real.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Timer check: two whole minutes without a joke. New personal record. And I didn't need one. Not with you.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 7 — Pre-ceremony nervousness, drops the act
// ──────────────────────────────────────────────

const sprocket_d7_low: DialogueScript = {
  id: 'sprocket_d7_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "So! Big ceremony tonight! No big deal! Just the ENTIRE rest of my life! Ha ha ha! *voice is an octave too high*",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "I've been practicing my acceptance speech! Or my rejection speech! I have both! Plus a third one that's mostly just screaming! Very versatile!",
      choices: [
        {
          text: '"Hey — whatever happens, you grew a lot this week."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Good luck tonight, Sprocket."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Try to relax."',
          next: 'minimal',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Grew a lot? I — *drops the manic energy for one second* ...Yeah. I guess I did, huh? Thanks for noticing. Even if I didn't make it easy.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Sprocket',
      text: "Luck! Yes! I need ALL the luck! And maybe a paper bag to breathe into! But mostly luck!",
      next: 'end',
    },
    minimal: {
      id: 'minimal',
      speaker: 'Sprocket',
      text: "Relax?! RELAX?! This is me relaxed! You should see me stressed! Actually no, you should NOT see me stressed, it involves a lot of waddling in circles!",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Okay! Off to the ceremony! If you hear someone hyperventilating behind the palm trees, mind your business! ...Kidding! Mostly!",
    },
  },
};

const sprocket_d7_mid: DialogueScript = {
  id: 'sprocket_d7_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Hey. Before the ceremony, can I just... talk to you for a second? Like, actually talk. One last time before everything gets all official.",
      next: 'real',
    },
    real: {
      id: 'real',
      speaker: 'Sprocket',
      text: "I came here as a penguin with a bunch of jokes and a whole lot of fear. And I think I'm leaving as a penguin with fewer jokes, more fear, but also... some real stuff. Some real connections.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "You helped with that. You know that, right? Like, genuinely helped me be less terrified of being myself.",
      choices: [
        {
          text: '"You did all the hard work. I just saw what was already there."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"It\'s been really special getting to know the real you."',
          next: 'warm',
          effects: { relationship_level: 6 },
        },
        {
          text: '"I\'m glad this week happened."',
          next: 'simple',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "Saw what was already there. *voice wobbles* You keep saying stuff like that and my no-crying streak is in SERIOUS danger. ...It was always there? Really?",
      next: 'end',
    },
    warm: {
      id: 'warm',
      speaker: 'Sprocket',
      text: "The real me. Who would've thought the real me would show up at a dating show on a tropical island? Life is WEIRD. But like... the good kind of weird.",
      next: 'end',
    },
    simple: {
      id: 'simple',
      speaker: 'Sprocket',
      text: "Me too. More than you know. This weird, scary, beautiful week changed everything. Even if I'm still gonna tell way too many jokes about it later.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Alright. Deep breath. *exhales* Let's go do this ceremony thing. And hey — if you're not laughing, I'm not trying hard enough. But also... even when you're not laughing, I'm glad you're here.",
    },
  },
};

const sprocket_d7_high: DialogueScript = {
  id: 'sprocket_d7_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Sprocket',
      text: "Before the ceremony... I need to say something. No jokes. No bits. No deflecting. Just me. Just this.",
      next: 'vulnerable',
    },
    vulnerable: {
      id: 'vulnerable',
      speaker: 'Sprocket',
      text: "A week ago I walked onto this island terrified that nobody would ever see past the jokes. That the real me — the scared, weird, too-loud penguin — would never be enough.",
      next: 'grateful',
    },
    grateful: {
      id: 'grateful',
      speaker: 'Sprocket',
      text: "And then I met you. And you didn't just tolerate the noise — you listened through it. You heard the stuff I was actually saying underneath all the ha-ha's. Nobody ever did that before.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Sprocket',
      text: "You made me believe I could be quiet and still be wanted. Do you have any idea how big that is for me?",
      choices: [
        {
          text: '"You never needed the act. You just needed someone to tell you that."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You\'re the bravest person I\'ve met here, Sprocket."',
          next: 'warm',
          effects: { relationship_level: 10 },
        },
        {
          text: '"I care about you. All of you. Jokes and silence and everything."',
          next: 'complete',
          effects: { relationship_level: 8 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Sprocket',
      text: "...*tears streaming, doesn't try to hide them* ...I'm not even going to make a joke about crying. I'm just going to stand here and let this be real. Because you taught me that's okay.",
      next: 'end',
    },
    warm: {
      id: 'warm',
      speaker: 'Sprocket',
      text: "Brave? Me? The penguin who hid behind punchlines for his entire life? *laughs through tears* ...Maybe. Maybe I am now. Because of you.",
      next: 'end',
    },
    complete: {
      id: 'complete',
      speaker: 'Sprocket',
      text: "All of me. The noise AND the quiet parts. *takes a shaky breath* I didn't think anyone would ever say that. I really, really didn't.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Sprocket',
      text: "Okay. *wipes eyes* Let's go to that ceremony. And whatever happens... thank you. For seeing me. The actual me. I'm never gonna forget that.",
    },
  },
};

// ──────────────────────────────────────────────
// Export: 7 days × 3 tiers = 21 scripts
// ──────────────────────────────────────────────

export const SPROCKET_DAILY: DialogueScript[][] = [
  // Day 1
  [sprocket_d1_low, sprocket_d1_mid, sprocket_d1_high],
  // Day 2
  [sprocket_d2_low, sprocket_d2_mid, sprocket_d2_high],
  // Day 3
  [sprocket_d3_low, sprocket_d3_mid, sprocket_d3_high],
  // Day 4
  [sprocket_d4_low, sprocket_d4_mid, sprocket_d4_high],
  // Day 5
  [sprocket_d5_low, sprocket_d5_mid, sprocket_d5_high],
  // Day 6
  [sprocket_d6_low, sprocket_d6_mid, sprocket_d6_high],
  // Day 7
  [sprocket_d7_low, sprocket_d7_mid, sprocket_d7_high],
];

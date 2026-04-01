import type { DialogueScript } from '@/utils/ink';

// ---------------------------------------------------------------------------
// KIKI — Day 1: Dismissive but curious, sizing up player, testing boundaries
// ---------------------------------------------------------------------------

const kiki_d1_low: DialogueScript = {
  id: 'kiki_d1_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: '*glances up* You again. The island is big, you know. Plenty of other people to bother.',
      next: 'test',
    },
    test: {
      id: 'test',
      speaker: 'Kiki',
      text: "...Fine. Since you're here. Tell me something. What's your worst quality? And don't give me some fake humble answer like 'I care too much.'",
      choices: [
        {
          text: '"I\'m stubborn. Once I decide someone\'s worth knowing, I don\'t give up."',
          condition: (v) => v.charm >= 30,
          lockMessage: 'Needs 30 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I talk too much sometimes."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Why should I tell you?"',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: '*narrows eyes* Stubborn. Interesting. Most people here fold the second you push back. Maybe you have a spine after all.',
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "At least you're honest. That's more than most people manage in a week here. Keep going at this rate and I might remember your name.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "*smirks* Now that's a reaction. Most people just scramble to impress. You're either brave or clueless. Haven't decided which.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "This conversation was... not the worst. Don't let that go to your head.",
    },
  },
};

const kiki_d1_mid: DialogueScript = {
  id: 'kiki_d1_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "Oh. You. I was watching you earlier. Not in a flattering way -- more like watching a puzzle box that hasn't been solved yet.",
      next: 'probe',
    },
    probe: {
      id: 'probe',
      speaker: 'Kiki',
      text: "Everyone here is so obvious. Their motivations are practically tattooed on their foreheads. But you... I can't quite read you. That either means you're deep or empty. Let's find out.",
      choices: [
        {
          text: '"Maybe I\'m just not performing for an audience."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"I could say the same about you."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"That\'s a weird thing to say."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "...Not performing. Hm. That's either the cleverest or the most dangerous thing someone's said to me here. I'm going to keep my eye on you.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "*slight smile* Deflecting with a mirror. Classic move. But fair. I'm not exactly an open book. I'm more like a book in a language you haven't learned yet.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Weird is my specialty. Normal is just a setting on a washing machine. But I'll dial it back. For now.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "The stars say we'll talk again. And the stars are rarely wrong. See you around.",
    },
  },
};

const kiki_d1_high: DialogueScript = {
  id: 'kiki_d1_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I told myself I wouldn't single anyone out this early. And yet here I am, walking straight toward you. Interesting.",
      next: 'drawn',
    },
    drawn: {
      id: 'drawn',
      speaker: 'Kiki',
      text: "There's something about your energy. Not loud. Not desperate. Just... present. Like a candle in a room full of neon signs. I came here expecting to be bored. You're making that difficult.",
      choices: [
        {
          text: '"Maybe you\'re not as bored as you pretend to be."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"I\'ll take that as a compliment."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That\'s a lot of metaphors for day one."',
          next: 'cold',
          effects: { relationship_level: 6 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*long pause* ...Careful. Seeing through me isn't a game most people win. But I'll admit -- you scored a point.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "It is one. I don't waste words on people who bore me. So consider yourself... noticed.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "*laughs* Fair. I can be a bit much. But would you rather I said 'you're neat' like everyone else? No. You deserve better metaphors than that.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "Curiosity never killed this cat -- it made her interesting. And you just became very interesting.",
    },
  },
};

// ---------------------------------------------------------------------------
// KIKI — Day 2: Caught sketching or doing tarot, intrigued by player
// ---------------------------------------------------------------------------

const kiki_d2_low: DialogueScript = {
  id: 'kiki_d2_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "*quickly closes sketchbook* I wasn't drawing anything. Especially not you. Don't flatter yourself.",
      next: 'caught',
    },
    caught: {
      id: 'caught',
      speaker: 'Kiki',
      text: "...Okay, I was sketching the group. Capturing people on paper is how I understand them. Faces lie, but the way someone holds their shoulders? That's truth.",
      choices: [
        {
          text: '"What do my shoulders say about me?"',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Can I see the sketches?"',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"That\'s a little invasive."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*opens sketchbook halfway* Your shoulders say you're carrying something but you don't want anyone to help. Stubborn and sweet. A dangerous combination.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "No. These are mine. But maybe someday, if you earn it. I don't show my art to just anyone. Art is a secret you share on purpose.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Invasive? I'd call it observant. But fine, I'll sketch the furniture instead. At least tables don't get offended.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "Run along. I've got a sunset to capture. Unless you want to be in the background. ...That wasn't an invitation.",
    },
  },
};

const kiki_d2_mid: DialogueScript = {
  id: 'kiki_d2_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "You caught me. I was reading tarot by the pool. Want me to pull a card for you? Fair warning -- the cards don't sugarcoat.",
      next: 'reading',
    },
    reading: {
      id: 'reading',
      speaker: 'Kiki',
      text: "*flips a card* The Tower. Change. Destruction of something false to make room for something real. The cards think you're about to lose something you thought you needed. Exciting, isn't it?",
      choices: [
        {
          text: '"Maybe what I\'m gaining is worth more than what I\'m losing."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"Do you actually believe in tarot?"',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"That sounds ominous."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*pauses mid-shuffle* ...You surprise me. Most people get scared of The Tower. You looked at it and saw opportunity. The cards like you. I might too.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Believe? Belief is boring. I use them as mirrors. People see what they need to see. The cards are just... permission to look honestly.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Ominous is just 'exciting' with worse lighting. Don't worry. The Tower means the lie falls, not the person.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "I'll pull another card for you tomorrow. If you come back. The deck seems to have opinions about you.",
    },
  },
};

const kiki_d2_high: DialogueScript = {
  id: 'kiki_d2_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I drew you last night. After everyone was asleep. Don't make it weird -- it's just charcoal on paper. But I thought you should know.",
      next: 'art',
    },
    art: {
      id: 'art',
      speaker: 'Kiki',
      text: "I only draw things that hold my attention. Sunsets. Strange architecture. Constellations I haven't identified yet. And now... you. The cards pulled The Star for you today. Hope. Inspiration. Someone who makes the darkness feel navigable.",
      choices: [
        {
          text: '"Can I see how you see me?"',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"The Star sounds like a good sign."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"You drew me? Why?"',
          next: 'cold',
          effects: { relationship_level: 6 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*slowly opens sketchbook* ...There. That's you. Or how I see you. Soft lines and steady eyes. Most people I draw in sharp angles. You're all curves. Gentle. It annoyed me at first.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "The Star is more than good. It's the card that comes after everything falls apart. The first light after the longest night. I don't pull it often.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Why does a cat stare at the moon? Because it's there and it's luminous and it won't look away first. That's why.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "Don't let it go to your head. I draw lots of things. ...But I've never shown anyone this fast. Make of that what you will.",
    },
  },
};

// ---------------------------------------------------------------------------
// KIKI — Day 3: Opens up about art/tarot/street performing past
// ---------------------------------------------------------------------------

const kiki_d3_low: DialogueScript = {
  id: 'kiki_d3_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I used to perform on street corners. Tarot readings for tourists, charcoal portraits for loose change. Don't look at me like that.",
      next: 'past',
    },
    past: {
      id: 'past',
      speaker: 'Kiki',
      text: "It wasn't sad. It was freedom. No address, no schedule, no one telling me who to be. Just me and a deck of cards and wherever the road went next.",
      choices: [
        {
          text: '"That sounds incredibly brave."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Didn\'t you get lonely?"',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Sounds unstable."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "Brave? *turns the word over* Nobody ever called it that. Most people just said 'reckless' or 'irresponsible.' Brave is... better. I'll keep that.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Lonely is a strong word. I was... alone. There's a difference. Alone is a choice. Lonely is what happens when the choice stops feeling like one.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Stability is a cage with nicer furniture. I'd rather have a messy life that's mine than a neat one someone else designed.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "Anyway. That's more than I usually share with someone on day three. Don't make me regret it.",
    },
  },
};

const kiki_d3_mid: DialogueScript = {
  id: 'kiki_d3_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I want to show you something. Come here. See this sketchbook? Every page is a different city. Every city is a different version of me.",
      next: 'stories',
    },
    stories: {
      id: 'stories',
      speaker: 'Kiki',
      text: "Paris, I was a portrait artist. Tokyo, a fortune teller. Barcelona, I busked with shadow puppets. Each place taught me something new about people. About how desperate everyone is to be seen.",
      choices: [
        {
          text: '"Who sees you, though?"',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That\'s an amazing life."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"So you never stayed anywhere?"',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*hand stops on the page* ...Nobody's asked me that before. Everyone loves the story of the wandering cat. Nobody wonders if the wandering cat wants to stop.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Amazing and exhausting. But mostly amazing. I wouldn't trade a single train ticket or cramped hostel. Those pages are more honest than any home I could have built.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Staying is overrated. You stay somewhere long enough and the walls start to feel like they own you. I refuse to be owned.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "You now know more about me than most people learn in months. Handle it carefully.",
    },
  },
};

const kiki_d3_high: DialogueScript = {
  id: 'kiki_d3_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "Sit down. I want to show you the last page of my sketchbook. The one I haven't drawn yet.",
      next: 'blank',
    },
    blank: {
      id: 'blank',
      speaker: 'Kiki',
      text: "Every other page has a city, a face, a moment. But this one... I've been saving it. For something worth stopping for. Something I haven't found yet. Or hadn't.",
      choices: [
        {
          text: '"Draw us. Right here, right now."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 11 },
        },
        {
          text: '"I hope you find what fills that page."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That\'s a lot of pressure for one blank page."',
          next: 'cold',
          effects: { relationship_level: 6 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*picks up charcoal, hand trembling slightly* ...I've drawn a hundred strangers without flinching. But drawing someone who matters? That terrifies me. Hold still.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Hoping is new for me. I usually just observe and move on. But something about this island -- about you -- is making me want to linger. That's never happened before.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "*laughs softly* Pressure? No. It's a promise. To myself. That someday something would be worth the last page. The question is whether that someday is now.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "The wandering cat sat still today. Write that in your diary. It won't happen again. ...Probably.",
    },
  },
};

// ---------------------------------------------------------------------------
// KIKI — Day 4: Tests player's trustworthiness directly
// ---------------------------------------------------------------------------

const kiki_d4_low: DialogueScript = {
  id: 'kiki_d4_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I'm going to ask you something, and I need you to answer honestly. No performance. No calculation. Just truth.",
      next: 'question',
    },
    question: {
      id: 'question',
      speaker: 'Kiki',
      text: "If I told you a secret -- something real, something that could hurt me -- would you keep it? Even if sharing it would make you more popular here?",
      choices: [
        {
          text: '"A secret trusted to me stays with me. Always."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Of course I would keep it."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Depends on the secret."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*studies your face for a long time* ...Your eyes didn't move when you said that. No flinch, no calculation. I almost believe you. That's further than most people get.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "That's what everyone says. The difference is in what happens next. I'll be watching. Not as a threat -- as a test.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Honest answer. Wrong answer, but honest. I respect that more than a pretty lie. At least I know where I stand with you.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "We'll see. Trust isn't given. It's built. One kept secret at a time.",
    },
  },
};

const kiki_d4_mid: DialogueScript = {
  id: 'kiki_d4_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I'm about to do something I never do. I'm going to trust you with something real. Don't make me regret it.",
      next: 'test',
    },
    test: {
      id: 'test',
      speaker: 'Kiki',
      text: "I know something about one of the other islanders. Something that would change how everyone sees them. It's eating me up. But it's not mine to tell. The question is: would you try to get it out of me?",
      choices: [
        {
          text: '"If it\'s not yours to tell, then I don\'t want to hear it."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Your boundaries are yours. I respect that."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Now I\'m curious, but I won\'t push."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*visibly exhales* ...Do you know how rare that is? Everyone on this island treats secrets like currency. You just walked past a vault and didn't even try the handle. You have no idea what that means to me.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Respect. There's a word I haven't heard used genuinely in a while. You mean it. I can tell because you're not trying to prove you mean it.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Curiosity is natural. Restraint is a choice. You chose restraint. That's enough for today.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "You passed. Don't let it go to your head. There are more tests. But... fewer than before.",
    },
  },
};

const kiki_d4_high: DialogueScript = {
  id: 'kiki_d4_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I need to ask you something, and I need you to look me in the eyes when you answer.",
      next: 'real',
    },
    real: {
      id: 'real',
      speaker: 'Kiki',
      text: "Everyone leaves. Everyone. I've watched it happen my whole life. People say they'll stay and then one morning their side of the bed is cold and their things are gone. So tell me -- why should I believe you'd be different?",
      choices: [
        {
          text: '"I can\'t promise I won\'t leave. But I can promise I\'ll never leave without telling you why."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"Because I\'m still here. And I keep coming back."',
          next: 'friendly',
          effects: { relationship_level: 9 },
        },
        {
          text: '"I don\'t know if I am different. But I\'m trying."',
          next: 'cold',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*long silence* ...That's the first honest answer anyone has ever given me to that question. You didn't promise the impossible. You promised the one thing that actually matters. Honesty.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Still here. Coming back. Four days in a row. ...That's four more than most people manage. Maybe the pattern is changing.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Trying. That's... more than most people offer. Most people promise everything and deliver nothing. You're promising nothing and delivering... something.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "I drew a door in my sketchbook tonight. First time I've drawn one that's open. Don't read into it. ...Okay, read into it a little.",
    },
  },
};

// ---------------------------------------------------------------------------
// KIKI — Day 5: Shares why she drifts between places
// ---------------------------------------------------------------------------

const kiki_d5_low: DialogueScript = {
  id: 'kiki_d5_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "You want to know why I move around so much. I can see it in your face. Fine. Sit.",
      next: 'drift',
    },
    drift: {
      id: 'drift',
      speaker: 'Kiki',
      text: "I leave places before they can become home. Because home means roots. And roots mean you can be pulled up. I've been pulled up before. I won't let it happen again.",
      choices: [
        {
          text: '"What if someone made the roots worth having?"',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"That makes sense in a sad way."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Sounds like running away."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*pauses* Worth having. Nobody's framed it like that before. It's always 'settle down' or 'grow up.' But 'worth having'... that's different.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Sad but functional. I see the world. I meet interesting people. I don't get hurt. ...That last part is the important one.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Running? Flying. There's a difference. Birds don't run -- they choose the sky. But I won't pretend the sky isn't lonely sometimes.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "That's more than enough vulnerability for one afternoon. Don't expect this every day.",
    },
  },
};

const kiki_d5_mid: DialogueScript = {
  id: 'kiki_d5_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I want to tell you something. Not because you asked, but because... I want to. And that's new for me.",
      next: 'reason',
    },
    reason: {
      id: 'reason',
      speaker: 'Kiki',
      text: "I drift because staying still means being known. And being known means being vulnerable. Every city I left, I left a version of myself behind. Like shedding skins. The question I can never answer is: which skin was real?",
      choices: [
        {
          text: '"Maybe all of them. Maybe you\'re not one thing."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"The real you is the one sitting here right now."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"That sounds exhausting."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*stares* All of them. That's... *voice goes quiet* That's the most generous thing anyone has ever said about me. You didn't try to simplify me. Thank you.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "The one sitting here. With no tarot cards, no sketchbook, no performance. Just... talking. Yeah. Maybe you're right. Maybe this is the real one.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Exhausting and exhilarating. Those two words share a border. I live right on the line.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "I haven't drifted yet. Five days. That's longer than Barcelona. Make of that what you will.",
    },
  },
};

const kiki_d5_high: DialogueScript = {
  id: 'kiki_d5_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I almost left last night. Packed my bag and everything. Had my hand on the door.",
      next: 'stayed',
    },
    stayed: {
      id: 'stayed',
      speaker: 'Kiki',
      text: "But I didn't leave. And that terrifies me more than any city I've ever arrived in. Because I realized the reason I stayed was you. And caring about someone's opinion is the most dangerous thing a drifter can do.",
      choices: [
        {
          text: '"Maybe danger is just another word for something worth fighting for."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"I\'m glad you stayed."',
          next: 'friendly',
          effects: { relationship_level: 9 },
        },
        {
          text: '"You don\'t have to stay for me."',
          next: 'cold',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*eyes widen* Worth fighting for. I've never... I've spent my whole life avoiding fights. But you make me want to stop avoiding. That scares me. And I don't scare easily.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Glad. Such a simple word. But it landed like a meteor. Nobody's been glad I stayed before. They've been glad I arrived. But staying? That's different.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "I know I don't have to. That's what makes it mean something. I choose to. Me. The cat who never chooses anything but the next train ticket.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "I unpacked my bag this morning. First time I've unpacked anywhere in two years. The suitcase looked strange sitting empty.",
    },
  },
};

// ---------------------------------------------------------------------------
// KIKI — Day 6: Rare vulnerability — reveals why she keeps walls up
// ---------------------------------------------------------------------------

const kiki_d6_low: DialogueScript = {
  id: 'kiki_d6_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I'm going to tell you something. Not to earn sympathy. But because you deserve context for why I am the way I am.",
      next: 'wall',
    },
    wall: {
      id: 'wall',
      speaker: 'Kiki',
      text: "I trusted someone once. Completely. Gave them my real name, my real story, everything behind the curtain. And they used it all to walk away with someone else. Took my secrets and shared them like party favors.",
      choices: [
        {
          text: '"That says everything about them and nothing about you."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I\'m sorry that happened to you."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Is that why you test everyone?"',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*goes very still* ...Nobody's ever separated their action from my worth before. Everyone just says 'move on' or 'you'll find someone better.' But you... you saw the real wound.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Don't be sorry. Be careful. That's all I ask. Careful with the things I show you. Because I'm showing you more than I showed them.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Yes. That's exactly why. The walls aren't decoration. They're scar tissue. But I'm telling you about the scar, which is more than I've done for anyone in years.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "Now you know. The mysterious cat is just a hurt cat with good aesthetics. Handle that information gently.",
    },
  },
};

const kiki_d6_mid: DialogueScript = {
  id: 'kiki_d6_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I haven't slept well. I've been thinking about things I usually keep locked in a very deep drawer. Your fault, by the way.",
      next: 'hurt',
    },
    hurt: {
      id: 'hurt',
      speaker: 'Kiki',
      text: "There was someone. Before all the cities. Before the tarot and the sketching. They were my home. And when they left, they took my home with them. I've been building temporary shelters ever since.",
      choices: [
        {
          text: '"You deserve a home that stays."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Thank you for telling me."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"You can\'t let one person ruin home for you forever."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*voice barely audible* A home that stays. That's all I've ever wanted. I just stopped believing it existed. ...You make me want to believe again. And that's the most terrifying sentence I've ever said out loud.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Thanking me for bleeding? That's very you. Gracious even when I'm falling apart. I don't know whether to be grateful or annoyed.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Can't I? Watch me. ...No. You're right. I know you're right. Knowing and feeling are two very different languages, though.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "I drew an open window tonight. First time in years it wasn't a locked door. The air felt good on the page.",
    },
  },
};

const kiki_d6_high: DialogueScript = {
  id: 'kiki_d6_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "I'm going to say something without armor. No metaphors. No deflection. Just me.",
      next: 'raw',
    },
    raw: {
      id: 'raw',
      speaker: 'Kiki',
      text: "I keep walls up because the one time I let them down, someone walked through and demolished everything behind them. I rebuilt myself from charcoal dust and tarot cards. And I swore I'd never let anyone that close again. But here you are. Standing at my wall. And I'm the one reaching for the door.",
      choices: [
        {
          text: '"You don\'t have to open it all at once. I\'ll wait."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"I won\'t walk through unless you invite me."',
          next: 'friendly',
          effects: { relationship_level: 9 },
        },
        {
          text: '"Kiki... I don\'t know what to say."',
          next: 'cold',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*tears fall before she can stop them* Wait. You'd wait. Everyone else tried to kick the door down or pick the lock. You'd just... wait. I don't know what to do with someone who waits.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "An invitation. That's what was missing every other time. Someone who asks instead of takes. Come in. I mean it. The door is open.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "You don't have to say anything. You being here is the sentence. You staying is the punctuation. Sometimes silence is the most eloquent response.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "I burned my old sketchbook tonight. The one with all the locked doors. Starting a new one tomorrow. First page is already planned.",
    },
  },
};

// ---------------------------------------------------------------------------
// KIKI — Day 7: Quiet pre-ceremony moment, reads player's fortune
// ---------------------------------------------------------------------------

const kiki_d7_low: DialogueScript = {
  id: 'kiki_d7_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "Last day. The stars are bright tonight. Like they're watching. I pulled a card for the ceremony. Want to know what it said?",
      next: 'fortune',
    },
    fortune: {
      id: 'fortune',
      speaker: 'Kiki',
      text: "The Wheel of Fortune. Everything changes tonight. Not good, not bad -- just different. The wheel doesn't judge. It just turns.",
      choices: [
        {
          text: '"Whatever the wheel brings, I\'m glad our paths crossed."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I hope the wheel is kind to both of us."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Guess we\'ll see what happens."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "Glad. You keep using that word. Simple words from you hit differently than poetry from everyone else. Maybe simplicity is its own kind of mystery.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Kindness and fortune rarely share a schedule. But tonight? I think they might make an exception.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "We will. That's the only honest answer. But the cards like honesty. You might be in their good graces.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "Whatever happens tonight -- I don't regret staying. And for a cat who regrets nothing, that's the closest thing to a love letter.",
    },
  },
};

const kiki_d7_mid: DialogueScript = {
  id: 'kiki_d7_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "Come sit with me. I want to read your full fortune before the ceremony. Three cards. Past, present, future. Let the universe have its say.",
      next: 'reading',
    },
    reading: {
      id: 'reading',
      speaker: 'Kiki',
      text: "Past: The Hermit. You spent a long time alone with yourself. Present: The Lovers. A choice. Not between people -- between who you were and who you're becoming. Future... *flips card* ...The Sun. Joy. Wholeness. Something found after a long search.",
      choices: [
        {
          text: '"I think you\'re my Sun card, Kiki."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"The Sun sounds promising."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Do you really see all that in three cards?"',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*hands go still on the cards* ...Nobody's ever called me sunlight before. Moonlight, maybe. Starlight if they were being kind. But sun? That's warmth. That's staying. You see me differently than I see myself.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "Promising. The Sun doesn't promise. It just shows up. Every morning, without fail. Maybe that's the lesson. Just keep showing up.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "I see possibilities. The cards show doors. You choose which ones to walk through. Tonight you'll choose a big one.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "Keep the Sun card. I'm giving it to you. I've never given away a card from my deck before. It'll find its way back to me if it's meant to.",
    },
  },
};

const kiki_d7_high: DialogueScript = {
  id: 'kiki_d7_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Kiki',
      text: "Before tonight, I need you to know something. I put down my cards and my sketchbook. No tools. No armor. Just me, looking at you.",
      next: 'final',
    },
    final: {
      id: 'final',
      speaker: 'Kiki',
      text: "I came to this island to prove that nobody could hold my attention. That love was just a story people told to make the dark less frightening. But you... you didn't try to hold my attention. You just were. And I couldn't look away. That's the most honest fortune I've ever read.",
      choices: [
        {
          text: '"I never wanted to hold you. I wanted to stand beside you."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You held my attention too, from the very first day."',
          next: 'friendly',
          effects: { relationship_level: 9 },
        },
        {
          text: '"Kiki, this week changed everything for me."',
          next: 'cold',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Kiki',
      text: "*tears fall freely* Beside. Not in front, not behind, not holding on. Beside. That's... that's the word I've been searching for across every city, every card, every sketch. Beside.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Kiki',
      text: "From day one. When I was cold and dismissive and testing every boundary. You saw through the performance and liked what you found. That takes a special kind of patience.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Kiki',
      text: "Changed. Yes. The wandering cat found a reason to sit still. The fortune teller got told her own future by someone who doesn't even believe in cards.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Kiki',
      text: "I filled the last page of my sketchbook. It's us. Under stars I haven't named yet. Because some things are better unnamed. They stay wild that way.",
    },
  },
};

// ---------------------------------------------------------------------------
// Export: 7 days × 3 tiers [low, mid, high]
// ---------------------------------------------------------------------------

export const KIKI_DAILY: DialogueScript[][] = [
  [kiki_d1_low, kiki_d1_mid, kiki_d1_high],
  [kiki_d2_low, kiki_d2_mid, kiki_d2_high],
  [kiki_d3_low, kiki_d3_mid, kiki_d3_high],
  [kiki_d4_low, kiki_d4_mid, kiki_d4_high],
  [kiki_d5_low, kiki_d5_mid, kiki_d5_high],
  [kiki_d6_low, kiki_d6_mid, kiki_d6_high],
  [kiki_d7_low, kiki_d7_mid, kiki_d7_high],
];

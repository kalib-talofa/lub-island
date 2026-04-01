import type { DialogueScript } from '@/utils/ink';

// ============================================================
// DAY 1 - Excited first meeting, garden tour offer, lots of puns
// ============================================================

const rosie_d1_low: DialogueScript = {
  id: 'rosie_d1_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: 'Oh! Hi there. Sorry, I was just... smelling these flowers. They remind me of home.',
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "I was thinking of exploring the garden later. It looks like there might be a little herb patch behind the villa. Would you want to come along?",
      choices: [
        {
          text: '"I\'d love to see it with someone who clearly knows their stuff."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Sure, a walk sounds nice."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Maybe another time."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: '*ears perk up* Oh stop it! But yes, I do know my way around a garden bed. Back home I had the tallest sunflowers on the whole hill.',
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Great! I spotted some lavender earlier and I am dying to get a closer look. We can make it a little adventure.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "Oh, no worries at all! The garden will still be there. And so will I, probably talking to the daisies.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Well, it was nice meeting you! I hope we get to chat more soon.",
    },
  },
};

const rosie_d1_mid: DialogueScript = {
  id: 'rosie_d1_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Hey, you! I just found a little patch of wild mint near the pool. Can you believe it? This island is like a secret garden waiting to happen!",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "I keep telling everyone we should do a garden tour but nobody seems as excited as me. Lettuce be honest, gardening is criminally underrated. Get it? Lettuce?",
      choices: [
        {
          text: '"That was terrible. Please never stop."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Ha! Okay, that got me."',
          next: 'friendly',
          effects: { relationship_level: 4 },
        },
        {
          text: '"I think I just lost brain cells."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: '*wiggles nose happily* Oh you are so my kind of person! I have a whole notebook of puns. You have NO idea what you just signed up for.',
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "See? Puns are the way to the heart! Or at least the way to a good groan. I have plenty more where that came from.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "*giggles* That's fair, that's fair. But I promise the garden tour would be way better than my comedy routine!",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Anyway, I'm so glad we're both here. This island already feels like something special, don't you think?",
    },
  },
};

const rosie_d1_high: DialogueScript = {
  id: 'rosie_d1_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "There you are! I was literally just thinking about you. I found the most amazing spot overlooking the ocean and there are wildflowers everywhere. You HAVE to see it.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "I know we just got here, but... is it weird that I already feel like this place is going to change everything? Like, I can feel it in my whiskers. Something good is happening.",
      choices: [
        {
          text: '"I feel it too. And I think meeting you is a big part of that."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"You might be onto something. This place has a good vibe."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Let\'s not get ahead of ourselves."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: '*ears turn pink* Oh my... you can\'t just SAY things like that! My heart just did a little hop. And I don\'t mean the bunny kind. Well... maybe a little the bunny kind.',
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Right?! The flowers, the sunset, the company... I swear this place is un-BUNNY-lievable. Sorry, I had to. It was right there.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "You're right, you're right. I just get carried away sometimes. But hey, even if I'm being silly, at least the view is real!",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Come on, let me show you those wildflowers before the sun goes down. Today feels like the start of something really beautiful.",
    },
  },
};

// ============================================================
// DAY 2 - Getting comfortable, shares gardening hobby, asks about player
// ============================================================

const rosie_d2_low: DialogueScript = {
  id: 'rosie_d2_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Oh, hello again! I was just drawing a little sketch of the herb garden. Do you... have any hobbies? I realize I don't know much about you.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "I spend most of my time back home in my garden. My friends say I care more about my tomato plants than I do about going out. Which... might be a little true.",
      choices: [
        {
          text: '"That\'s honestly kind of adorable. What else do you grow?"',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Nothing wrong with that. Everyone needs their thing."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Sounds a little lonely."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "Adorable? *twitches nose* Well... I grow carrots obviously, that's a given. But also lavender, basil, and I just started trying moonflowers. They only bloom at night!",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "That's sweet of you to say. Gardening just makes sense to me, you know? You plant something small and you watch it become something wonderful.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "Oh... I mean, the plants are good company! But yeah, I guess that's kind of why I'm here. Trying to grow something new. With someone.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Anyway, I should get back to my sketch. But thanks for listening. Not everyone does.",
    },
  },
};

const rosie_d2_mid: DialogueScript = {
  id: 'rosie_d2_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Oh good, I was hoping I'd run into you! I discovered the island has a little greenhouse tucked behind the villa. Want to hear about what I found?",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "There are orchids in there! Wild ones! Back home I've been trying to grow orchids for three years and I cannot get them right. But here they just... grow. It's humbling, honestly. So tell me, what's your thing? What do you geek out about?",
      choices: [
        {
          text: '"Right now? Watching your eyes light up talking about orchids."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"I love seeing people passionate about stuff. Tell me more."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I don\'t really have a thing like that."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: '*covers face with ears* Oh my GOSH you are way too smooth! I bet you say that to every bunny. Wait -- every BUNNY -- I did it again!',
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Really? Okay so -- orchids need exactly the right humidity, and the roots need airflow, and back home my burrow is just too dry. I could talk about this for hours. Should I stop?",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "Oh, that's okay! Honestly, I didn't think I had a thing either until I accidentally grew my first sunflower and it was taller than me. Sometimes your thing finds you.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "I really like talking with you. It feels easy, you know? Like watering a plant that was already ready to bloom. ...Too much? That was too much.",
    },
  },
};

const rosie_d2_high: DialogueScript = {
  id: 'rosie_d2_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "I saved you a spot! Come sit. I picked these little flowers on my walk and I wanted to show you something my mum taught me.",
      next: 'offer',
    },
    offer: {
      id: 'offer',
      speaker: 'Rosie',
      text: "*carefully weaves stems together* See? If you braid them like this, they make a little crown. My mum used to make one for me every birthday. I... haven't told anyone that before.",
      choices: [
        {
          text: '"That\'s beautiful. Would you make one for me?"',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That sounds like a really special memory."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Your mum sounds nice."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*beams* You want one? Really? Here... *places flower crown gently* There. Now you're officially island royalty. And I'm officially a sap.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "It really is. She always said that growing things is how you show love without saying it. I think about that a lot, especially here.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "She really is. The sweetest rabbit you'd ever meet. I think she'd like this island. All the growing things.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Thanks for sitting with me. I know it's just flowers, but sharing them with you makes them feel more real somehow.",
    },
  },
};

// ============================================================
// DAY 3 - Opens up about WHY she's on the island -- looking for real connection
// ============================================================

const rosie_d3_low: DialogueScript = {
  id: 'rosie_d3_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Hey. Can I be a little honest with you? I know we're still getting to know each other, but...",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "Everyone here seems like they already know what they want. And I keep smiling and making puns, but sometimes I wonder if anyone actually sees me. Does that sound silly?",
      choices: [
        {
          text: '"Not silly at all. Being real takes courage."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I think everyone feels that way sometimes."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"I mean, we barely know each other."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "...Thank you. Really. I came here because I wanted to find something genuine. Not just someone who laughs at my jokes, but someone who wants to know the rabbit behind them.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Yeah, I guess you're right. It's just... back home I was always the cheerful one. I came here hoping to find someone I don't have to perform for.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "You're right. Sorry, I didn't mean to dump all that on you. I just... thought maybe you'd understand. Never mind!",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Anyway. I'm glad I said something, even if it was awkward. That's growth, right? Like a little sprout.",
    },
  },
};

const rosie_d3_mid: DialogueScript = {
  id: 'rosie_d3_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "I need to tell you something. I've been thinking about why I actually came here, and I think you deserve to hear it.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Rosie',
      text: "I write love letters. Well... I WROTE them. Dozens of them. But I never sent a single one. I was always too scared. I came here because I'm tired of being scared. I want to actually say the things I feel, out loud, to a real person.",
      choices: [
        {
          text: '"That might be the bravest thing anyone\'s told me here."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"I think that took a lot of guts to share."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Unsent love letters? That\'s kind of sad."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*eyes glistening* Brave? I don't feel brave. I feel like a bunny standing in headlights. But... if you think it's brave, then maybe I can be brave a little more.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Thank you. I've never told anyone about the letters before. It feels lighter now that someone knows. Like repotting a plant that outgrew its container.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "*flinches slightly* ...Yeah. I guess it is. But that's why I'm here, right? So the next letter isn't unsent. So the next one actually matters.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "I'm really glad I told you. Whatever happens on this island, at least I'm finally being honest. That counts for something.",
    },
  },
};

const rosie_d3_high: DialogueScript = {
  id: 'rosie_d3_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "*pulls you aside* Hey. I've been waiting for the right moment to tell you this, and I think... I think you're the right person to hear it.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Rosie',
      text: "I came here because I spent my whole life writing love letters to people I never told. Poems in the margins of my seed catalogues. Confessions to sunflowers. I was so full of love and so terrified to give it to anyone real.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "But being here, talking to you... I feel like maybe those letters were practice. For something real. For someone who actually listens.",
      choices: [
        {
          text: '"I\'m listening. And I\'m not going anywhere."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"You deserve someone who reads every word."',
          next: 'friendly',
          effects: { relationship_level: 7 },
        },
        {
          text: '"That\'s a lot of pressure to put on someone."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*voice cracks* You... really mean that? Because I have spent so long talking to flowers, and none of them ever said anything that good back.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "*sniffles* That's the sweetest thing. I do deserve that, don't I? My mum always said I give so much love I forget to save some for myself.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "Oh -- no, I didn't mean it like that! I just meant... you make me feel safe enough to say these things. But you're right, I should be careful.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Thank you for letting me be honest. With you, I don't feel like I need a pun to hide behind. And that's... kind of everything.",
    },
  },
};

// ============================================================
// DAY 4 - Reveals the pressure to always be cheerful/positive
// ============================================================

const rosie_d4_low: DialogueScript = {
  id: 'rosie_d4_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Hey. I'm having kind of a rough morning. I know, I know -- sunshine Rosie having a bad day, what a shock.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "Someone told me yesterday that I'm always so happy, and I should have just said thanks, but instead it made me feel... weirdly empty? Like that's all anyone sees.",
      choices: [
        {
          text: '"You\'re allowed to have layers. No one should reduce you to just one mood."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Everyone has bad days. That\'s normal."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"I mean, you do always seem pretty cheerful."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "...Layers. Yeah. I like that. Sometimes I feel like a carrot cake where everyone only notices the frosting and forgets there's actual cake underneath.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "I know. I just wish people asked HOW I was instead of just assuming. But that's partly on me, right? I'm the one who always says she's fine.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "*ears droop slightly* ...Yeah. I do. That's kind of the problem. But thanks for being honest, I guess.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Sorry for being a downer. Tomorrow I'll be back to my punny self. Probably. Maybe.",
    },
  },
};

const rosie_d4_mid: DialogueScript = {
  id: 'rosie_d4_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Can we talk? I had this moment last night where I was practicing my smile in the mirror and I just... stopped. And stared at myself. And wondered who I was doing it for.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "Everyone expects me to be the bubbly one. The pun bunny. And I love puns, I really do! But sometimes I use them like armor. If everyone's laughing, nobody asks if you're okay.",
      choices: [
        {
          text: '"The fact that you recognize that is huge. I see you, Rosie -- the real you."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"Using humor as armor -- I think a lot of people do that."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"You don\'t have to perform for me."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: '*takes a shaky breath* The real me is a rabbit who cries at sunsets and talks to her tomato plants and is terrified nobody will love her if she stops being funny. ...That was a lot.',
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Right? It's like... if the puns stop, will people still want to be around me? What if the real Rosie isn't enough? I've never said that out loud before.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "I know I don't have to. It's just... hard to turn off something you've been doing your whole life. But I'm trying. Being here is me trying.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "You know what? Even this conversation, just being real with you... it feels like pulling a weed I've been ignoring. Painful but necessary.",
    },
  },
};

const rosie_d4_high: DialogueScript = {
  id: 'rosie_d4_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "*sitting alone, looking out at the ocean* Hey. I'm glad it's you. I don't think I could have this conversation with anyone else.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Rosie',
      text: "I've been the happy one my entire life. In my family, in my friend group, on this island. And most of the time I genuinely am happy. But there's this pressure that comes with it -- like I'm not allowed to NOT be.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "If I'm sad, people worry. If I'm quiet, they ask what's wrong. So I learned to always have a pun ready. Always have a smile loaded. And I'm exhausted.",
      choices: [
        {
          text: '"Then let me be the person you can be exhausted around."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"You don\'t owe anyone your sunshine."',
          next: 'friendly',
          effects: { relationship_level: 7 },
        },
        {
          text: '"That sounds really tiring."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*tears up* Nobody has ever... most people just want the bubbly version. You actually want the messy one too? That's... *wipes eyes* ...that's the most romantic thing anyone's ever said to me. And I've READ a lot of romance.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "*quiet laugh* My sunshine. I like that framing. Like it's something I choose to share, not something people get to demand. Thank you for that.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "It really is. But just hearing someone acknowledge that... it actually helps. More than you know.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "*leans against your shoulder* I don't have a pun for this moment. And honestly? That feels like the most honest I've been in years.",
    },
  },
};

// ============================================================
// DAY 5 - Deeper conversation about authenticity vs performing happiness
// ============================================================

const rosie_d5_low: DialogueScript = {
  id: 'rosie_d5_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "I was watching everyone at breakfast, putting on their best faces, and I just kept thinking... how much of what any of us show is real?",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "Like, I know I'm guilty of it. I make everything a joke. But at least I'm starting to notice it now. I guess that's step one?",
      choices: [
        {
          text: '"Awareness is everything. The fact that you\'re questioning it means you\'re already changing."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Yeah, recognizing patterns is a good first step."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Everybody performs a little. It\'s just life."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "Changing... I like that word. Back home I was so stuck. Same garden, same puns, same smile. Here at least the soil is different. Maybe I can grow differently too.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Right. Step one: notice. Step two: try being real even when it's scary. Step three: probably cry. I'm already good at step three.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "Maybe. But I don't want to just accept that. I want to find someone who makes performing feel unnecessary. Is that too much to ask?",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Thanks for letting me think out loud. I'm still figuring a lot of things out.",
    },
  },
};

const rosie_d5_mid: DialogueScript = {
  id: 'rosie_d5_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "You know what I realized last night? I've spent so long being the version of Rosie that everyone likes, I'm not sure I know which parts are performance and which parts are real.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "Like, do I actually love puns? YES, absolutely, those are real. But do I always feel like making them? No. Sometimes I'm sad and I make a joke anyway because silence scares me more.",
      choices: [
        {
          text: '"What if I told you the silence between us doesn\'t scare me at all?"',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"The real parts and the performance parts -- they\'re both you."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Maybe you should try just sitting with the quiet sometime."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*pauses. Just looks at you for a long moment* ...See? You just did it. You let the silence exist and it was... actually kind of beautiful. Okay now I'm going to cry.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Both me? Huh. I never thought of it that way. Like... the joke IS real, it just doesn't have to be the ONLY thing that's real. That actually helps a lot.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "The quiet? That sounds terrifying. But also... maybe you're right. I could try. Just a little bit of quiet. Starting now. *sits silently for two seconds* Okay that's all I've got.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "I feel like every conversation with you peels back a layer. Like an onion, except less crying. Well... roughly the same amount of crying, actually.",
    },
  },
};

const rosie_d5_high: DialogueScript = {
  id: 'rosie_d5_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "*takes your hand and leads you to a quiet spot* I want to try something. I want to tell you exactly what I'm feeling without a single pun or joke. Just... raw Rosie.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Rosie',
      text: "I'm scared. I'm scared that the person I am when I stop performing isn't someone worth loving. I'm scared that my real feelings are too big and too messy. And I'm scared that saying all this will make you look at me differently.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "*voice barely above a whisper* But I'm more scared of never saying it. So there it is. All of it.",
      choices: [
        {
          text: '"I\'m looking at you right now, and all I see is someone worth every single moment."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"Your messy feelings are what make you real. Don\'t ever apologize for them."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That took a lot to say. I respect that."',
          next: 'cold',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*tears streaming, smiling through them* You know... all those love letters I wrote? None of them had a reply this good. And this is the first time I didn't need a letter at all.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Don't apologize for them... *laughs through tears* My mum says the same thing. Maybe I should start listening. Starting with this moment, right now.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "Respect. That's... that's something. I'll take it. Not every seed sprouts into a flower, but at least you let me plant it.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "*squeezes your hand* I didn't make a single pun that whole conversation. That might be the most authentic I've ever been. Don't tell anyone... or actually, do. I'm done hiding.",
    },
  },
};

// ============================================================
// DAY 6 - Vulnerable moment -- fears being "too much" for people
// ============================================================

const rosie_d6_low: DialogueScript = {
  id: 'rosie_d6_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Can I ask you something? And please be honest. ...Am I too much? Like, as a person?",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "I've been told before that I'm overwhelming. Too energetic, too emotional, too many puns. An ex once told me I was exhausting. That kind of thing sticks with you.",
      choices: [
        {
          text: '"Whoever said that was too small for you. You\'re not too much -- they were too little."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"The right person won\'t think you\'re too much."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"I can see how you\'d be a lot for some people."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*blinks* ...They were too little? I've literally never thought of it that way. I always assumed the problem was me being too big. But maybe... maybe I just need a bigger pot.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "The right person. Yeah. I keep hoping they're out here somewhere. Maybe even on this island. I just have to believe that.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "*ears flatten* ...Yeah. That's what I figured. Thanks for being honest, at least. That's more than most people give me.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "I didn't mean to get heavy. It's just... with the ceremony coming up, everything feels more real.",
    },
  },
};

const rosie_d6_mid: DialogueScript = {
  id: 'rosie_d6_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "I couldn't sleep last night. I kept thinking about something, and I need to say it before I lose my nerve.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Rosie',
      text: "My biggest fear isn't being alone. It's being with someone and STILL feeling alone because they only love the version of me I show them. The happy one. The punny one. What if the real me makes them leave?",
      choices: [
        {
          text: '"The real you is the one I want to know. Every part, even the parts that scare you."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Anyone who leaves because you\'re real doesn\'t deserve the performance either."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"That\'s a heavy fear to carry."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*voice breaks* Every part? Even the part that named her houseplants and cries when one of them dies? Even the part that's scared right now?",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "Doesn't deserve the performance either... wow. I'm going to write that down. Seriously, that's going in my garden journal right next to the lavender notes.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "It is heavy. But sharing it with you makes it a little lighter. Even if it's just for right now, that matters.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Whatever happens at the ceremony... I want you to know that THIS version of me, the scared and honest one, is the one you got. And that means something to me.",
    },
  },
};

const rosie_d6_high: DialogueScript = {
  id: 'rosie_d6_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "*finds you, eyes red from crying* I'm sorry. I know I look a mess. I just... I need you right now. Is that okay?",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Rosie',
      text: "I overheard someone say I was 'cute but shallow.' And I KNOW it shouldn't matter. I know I'm more than that. But it hit something old. Something I thought I'd buried under all the sunflowers and the puns.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "*trembling* What if everyone just sees me as a silly bunny who can't be taken seriously? What if that's all I am?",
      choices: [
        {
          text: '"Come here. You are the deepest, most genuine soul on this island and I will tell you that every day until you believe it."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You are not shallow. The person who said that doesn\'t know you like I do."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"People say dumb things. Try not to let it get to you."',
          next: 'cold',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*collapses into your arms* Every day? You'd really...? *crying and laughing* I'm getting tears all over your shirt and making terrible sniffling sounds and this is NOT cute and you're STILL here.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "*wipes eyes* You know me. You really, actually know me. Not just garden-Rosie or pun-Rosie but... crying-at-sunset, scared-of-being-too-much Rosie. And you're still standing here.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "*takes a steadying breath* You're right. It's just words. But when you carry something for so long, even small words can feel like boulders. Thank you for not walking away.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "*softly* This is me without the mask. Puffy eyes, messy fur, zero puns. And somehow, standing here with you, I feel more like myself than I ever have.",
    },
  },
};

// ============================================================
// DAY 7 - Reflects on island experience, hopeful about ceremony, grateful
// ============================================================

const rosie_d7_low: DialogueScript = {
  id: 'rosie_d7_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Can you believe it's already the last day? This week went by faster than a rabbit in a... well, you know the saying.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "I know we didn't get to know each other as well as I'd hoped, but I wanted to say... I'm glad you were here. Truly.",
      choices: [
        {
          text: '"It\'s not too late. Some of the best things bloom at the last minute."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I\'m glad I was here too. It\'s been a good week."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Yeah, it went fast."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*perks up* Bloom at the last minute... I love that. You know, late-season flowers are actually some of the most beautiful. Maybe there's still time for us to surprise each other.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "It really has been. I've learned a lot about myself this week. More than I expected, honestly. And you were a part of that.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "Yeah... *small smile* Well, even short-lived flowers are worth planting. That's what I always say. Or at least, that's what I say now.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Whatever happens at the ceremony tonight, I'm walking away from this island a braver bunny. And that's worth everything.",
    },
  },
};

const rosie_d7_mid: DialogueScript = {
  id: 'rosie_d7_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "Last day. I picked you these -- *holds out a small bouquet of island wildflowers* -- because I wanted to say thank you properly.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "This week, you helped me realize something. I came here looking for someone to love me, but what I actually needed was permission to be myself. And you gave me that just by listening.",
      choices: [
        {
          text: '"You never needed permission. You just needed someone to hold the door open. I\'m glad it was me."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"You did that yourself, Rosie. I was just here for it."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"I\'m glad the island was good for you."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*clutches the flowers to her chest* Held the door open... that's exactly what it felt like. Like you opened a door I'd been knocking on my whole life and just said 'come on in.'",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "I did, didn't I? Wow. Maybe I'm stronger than I thought. But having someone believe in you while you figure it out... that's no small thing.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "It was. It really was. Even if things between us didn't go the way I imagined, this island changed me. And I'll carry that home like a seed.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Good luck tonight. And hey... lettuce be honest, you're un-bunny-lievable. *grins* What? I had to end the week the way I started it.",
    },
  },
};

const rosie_d7_high: DialogueScript = {
  id: 'rosie_d7_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Rosie',
      text: "*runs up and hugs you* I know the ceremony hasn't started yet but I don't care. I need to say this while I'm brave enough.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Rosie',
      text: "I came to this island with a suitcase full of unsent love letters and a heart full of hope I was too afraid to use. And then I met you. And suddenly all those words I'd been saving found somewhere to go.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Rosie',
      text: "*holding your hands, ears trembling* You saw through every pun, every smile, every deflection. You found the real me hiding in the garden and you didn't run. You stayed.",
      choices: [
        {
          text: '"I stayed because the real you is the most incredible person I\'ve ever met. And I\'m not going anywhere."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You didn\'t need me to find you. You were there all along."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"This week has meant a lot to me too."',
          next: 'cold',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Rosie',
      text: "*happy tears flowing* You're not going anywhere? Because I have so many more terrible puns and so many more real feelings and a carrot cake recipe I've been perfecting for YEARS and I want to share all of it with you.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Rosie',
      text: "*laughs softly* There all along... maybe you're right. But you made me believe she was worth finding. The scared, messy, pun-loving, garden-growing, letter-writing real me.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Rosie',
      text: "It has? *searches your eyes* Even if you can't say everything I want to hear... knowing it meant something is enough. It's more than those letters ever got back.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Rosie',
      text: "Whatever happens tonight, I want you to know -- you're the first person I didn't need to write a letter for. Because with you, I finally had the courage to just say it out loud.",
    },
  },
};

export const ROSIE_DAILY: DialogueScript[][] = [
  [rosie_d1_low, rosie_d1_mid, rosie_d1_high],
  [rosie_d2_low, rosie_d2_mid, rosie_d2_high],
  [rosie_d3_low, rosie_d3_mid, rosie_d3_high],
  [rosie_d4_low, rosie_d4_mid, rosie_d4_high],
  [rosie_d5_low, rosie_d5_mid, rosie_d5_high],
  [rosie_d6_low, rosie_d6_mid, rosie_d6_high],
  [rosie_d7_low, rosie_d7_mid, rosie_d7_high],
];

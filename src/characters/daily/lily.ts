import type { DialogueScript } from '@/utils/ink';

// ──────────────────────────────────────────────
// Day 1 — Quiet introduction, nature observation, mentions journal
// ──────────────────────────────────────────────

const lily_d1_low: DialogueScript = {
  id: 'lily_d1_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Oh... hello. I was just watching that dragonfly. It's been circling the same hibiscus for ten minutes. I think it's in love.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "Sorry, I know that's a strange thing to say to someone you just met. I'm Lily. I keep a journal of things like this.",
      choices: [
        {
          text: '"A nature journal? That\'s really cool."',
          condition: (v) => v.charm >= 30,
          lockMessage: 'Needs 30 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Nice to meet you, Lily."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Huh. Interesting hobby."',
          next: 'distant',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "You think so? Most people find it... quiet. But then, the best things usually are. *small smile* I've already catalogued three new species since arriving.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Lily',
      text: "Nice to meet you too. The frangipani here is lovely, by the way. Can you smell it? The island is introducing itself to us.",
      next: 'end',
    },
    distant: {
      id: 'distant',
      speaker: 'Lily',
      text: "It is. To me, anyway. *turns back to the hibiscus* The dragonfly left. That's a shame.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I should go find a quiet spot to sketch that hibiscus before the light changes. The forest has all the answers... if you listen.",
    },
  },
};

const lily_d1_mid: DialogueScript = {
  id: 'lily_d1_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Good morning. Did you notice the moss on the north side of the villa? It's a species I've never seen before. I've been sketching it since dawn.",
      next: 'share',
    },
    share: {
      id: 'share',
      speaker: 'Lily',
      text: "Back home, my lily pad sat at the edge of an ancient rainforest. I kept a journal of every wildflower I found. This island feels like a new chapter in that journal.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "Do you ever pay attention to the small things? The patterns in bark, the way water catches light?",
      choices: [
        {
          text: '"I try to. But I bet I\'d see so much more with your eyes."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"Sometimes, when I slow down enough."',
          next: 'honest',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Not really, to be honest."',
          next: 'candid',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*blushes slightly* That's... a very kind thing to say. I could show you sometime, if you'd like. The island has so much to share with anyone willing to look.",
      next: 'end',
    },
    honest: {
      id: 'honest',
      speaker: 'Lily',
      text: "Slowing down is the hardest part, isn't it? But it's where everything good hides. The quiet between the noise — that's where the real things live.",
      next: 'end',
    },
    candid: {
      id: 'candid',
      speaker: 'Lily',
      text: "That's honest. I appreciate honesty. Maybe this island will change that. Nature has a way of asking you to notice, even when you're not looking.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I'm going to go press a frangipani blossom into my journal. The first flower of a new place always deserves a page of its own.",
    },
  },
};

const lily_d1_high: DialogueScript = {
  id: 'lily_d1_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I've been sitting here since before sunrise, watching the light change on the water. Every minute it's a different painting.",
      next: 'personal',
    },
    personal: {
      id: 'personal',
      speaker: 'Lily',
      text: "I wrote in my journal this morning that this island feels like a held breath — like it's been waiting for something. A fortune-teller told me my next chapter begins on an island. Maybe this is it.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "Do you believe in things like that? Signs from nature? Or do you think I'm just a silly frog who talks to flowers?",
      choices: [
        {
          text: '"I think paying attention to the world is the opposite of silly."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"I\'m not sure about signs, but I like how you see things."',
          next: 'open',
          effects: { relationship_level: 7 },
        },
        {
          text: '"I think things happen for a reason, yeah."',
          next: 'agreeable',
          effects: { relationship_level: 6 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*eyes light up* You understand. Or at least you want to, which might be even better. Some people hear 'I talk to plants' and just... stop listening.",
      next: 'end',
    },
    open: {
      id: 'open',
      speaker: 'Lily',
      text: "You like how I see things? *tucks a strand of hair behind her ear* That's a very lovely way to say you think I'm strange. And I mean that as a compliment.",
      next: 'end',
    },
    agreeable: {
      id: 'agreeable',
      speaker: 'Lily',
      text: "I hope so. I came a very long way based on a feeling and a fortune-teller's words. It would be nice if the island had something waiting for me.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "Thank you for sitting with me in the quiet. Not everyone is comfortable with that. I think the island noticed you too, just now.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 2 — Shows player something special in nature
// ──────────────────────────────────────────────

const lily_d2_low: DialogueScript = {
  id: 'lily_d2_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Oh — look. Right there, under that fallen palm frond. See those tiny mushrooms? They're bioluminescent. They'll glow blue tonight.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "I found them during my morning walk. Most people would step right over them without noticing.",
      choices: [
        {
          text: '"They\'re beautiful. You have such an eye for this."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Cool, I\'ve never seen glowing mushrooms."',
          next: 'casual',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Neat."',
          next: 'brief',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "Thank you. *kneels beside them carefully* They grow where something has decayed. New light from old endings. I love that about nature.",
      next: 'end',
    },
    casual: {
      id: 'casual',
      speaker: 'Lily',
      text: "They're quite rare. The mycelium network beneath them connects half this grove. A whole hidden world under our feet.",
      next: 'end',
    },
    brief: {
      id: 'brief',
      speaker: 'Lily',
      text: "...Neat. *quiet pause* I suppose not everything speaks to everyone the same way. That's all right.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I'll come back tonight to sketch them when they glow. Some things only reveal themselves in the dark.",
    },
  },
};

const lily_d2_mid: DialogueScript = {
  id: 'lily_d2_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I have something to show you. Come this way — carefully, watch the roots. There's an orchid growing in the crook of that tree. See it?",
      next: 'explain',
    },
    explain: {
      id: 'explain',
      speaker: 'Lily',
      text: "It's a ghost orchid. They're incredibly rare — they have no leaves and survive entirely on the tree they bond with. A life built completely on connection.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "I wanted you to see it because... well, I thought you'd appreciate it. Not everyone would.",
      choices: [
        {
          text: '"You thought of me when you found this? That means a lot."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"It\'s amazing how it survives like that."',
          next: 'curious',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Thanks for showing me."',
          next: 'polite',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*soft smile* I did. When I find something beautiful, I notice I think about who would understand it. You kept coming to mind.",
      next: 'end',
    },
    curious: {
      id: 'curious',
      speaker: 'Lily',
      text: "It can't survive alone. It needs the tree. There's something honest about that — admitting you need something outside yourself to bloom.",
      next: 'end',
    },
    polite: {
      id: 'polite',
      speaker: 'Lily',
      text: "Of course. Some discoveries are better shared. Even for someone who usually prefers her own company.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I'm going to add it to my journal. Page forty-seven — right between the moss and the tide pools. Every beautiful thing deserves its place.",
    },
  },
};

const lily_d2_high: DialogueScript = {
  id: 'lily_d2_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Close your eyes for a moment. I want to try something. ...Are they closed? Good. Now breathe in. What do you smell?",
      next: 'guide',
    },
    guide: {
      id: 'guide',
      speaker: 'Lily',
      text: "There's jasmine on the wind — the night-blooming kind. And wet earth from the morning rain. And underneath all of it, the salt of the ocean. The island is telling you its story through scent alone.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "Open your eyes. *she's holding a tiny, perfect blue flower* I found this growing in a crack in the seawall. Life, insisting on happening even where it shouldn't.",
      choices: [
        {
          text: '"This is the most thoughtful gift anyone\'s ever given me."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 11 },
        },
        {
          text: '"You see the whole world differently, don\'t you?"',
          next: 'wonder',
          effects: { relationship_level: 8 },
        },
        {
          text: '"It\'s beautiful. Like the orchid yesterday."',
          next: 'connected',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*presses the flower gently into your palm* Then it found the right person. I've learned that nature sends things where they're needed. Maybe it sent me here too.",
      next: 'end',
    },
    wonder: {
      id: 'wonder',
      speaker: 'Lily',
      text: "I see the world the only way I know how — slowly, carefully, with wonder. And lately... I see it a little more clearly when you're nearby.",
      next: 'end',
    },
    connected: {
      id: 'connected',
      speaker: 'Lily',
      text: "You remembered the orchid. *eyes soften* You listen. Really listen. Do you know how rare that is? Rarer than any flower I've found.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "Keep that flower. Press it in a book if you can. Someday you'll find it again and remember this morning. That's what nature does — it holds our memories for us.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 3 — Shares a journal entry, perfectionist side
// ──────────────────────────────────────────────

const lily_d3_low: DialogueScript = {
  id: 'lily_d3_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I've been trying to draw the sunset from last night and I can't get the colours right. I've torn out three pages already.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "My journal has to be accurate. If I can't capture something truthfully, I'd rather leave the page blank.",
      choices: [
        {
          text: '"Maybe imperfect is still worth keeping."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Sounds like you set a high bar for yourself."',
          next: 'observant',
          effects: { relationship_level: 3 },
        },
        {
          text: '"It\'s just a drawing though, right?"',
          next: 'dismissive',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "Imperfect... worth keeping. *pauses* That's a thought I need to sit with. I'm not very good at accepting imperfect things. Especially from myself.",
      next: 'end',
    },
    observant: {
      id: 'observant',
      speaker: 'Lily',
      text: "I do. The forest doesn't make mistakes — every leaf falls exactly where it should. I suppose I hold my journal to the same standard. Which is... probably unfair.",
      next: 'end',
    },
    dismissive: {
      id: 'dismissive',
      speaker: 'Lily',
      text: "*quiet for a moment* ...It's not just a drawing to me. But I understand that's hard to see from the outside.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I think I'll try once more before the light changes. Some things take patience. Most things, actually.",
    },
  },
};

const lily_d3_mid: DialogueScript = {
  id: 'lily_d3_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Would you... like to see my journal? I don't usually show anyone. But I thought maybe you'd understand.",
      next: 'show',
    },
    show: {
      id: 'show',
      speaker: 'Lily',
      text: "*opens to a page with pressed flowers and careful ink sketches* This is the ghost orchid from yesterday. And here — this is a fern I found near the waterfall. I wrote a little poem beside it.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "Every entry takes hours. I have to get the details right — the exact shade, the number of petals, the way the light hits. Anything less feels like a lie.",
      choices: [
        {
          text: '"This isn\'t a journal. It\'s a love letter to the world."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"These drawings are incredible, Lily."',
          next: 'admiring',
          effects: { relationship_level: 6 },
        },
        {
          text: '"You put so much care into this."',
          next: 'respectful',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "A love letter to the... *holds journal to her chest* Nobody has ever described it that way. That's exactly what it is. How did you know?",
      next: 'end',
    },
    admiring: {
      id: 'admiring',
      speaker: 'Lily',
      text: "Thank you. They're never quite right to me — there's always something I wish I could fix. But hearing you say that... maybe right enough is still valuable.",
      next: 'end',
    },
    respectful: {
      id: 'respectful',
      speaker: 'Lily',
      text: "Care is the right word. Every page is a promise to the thing I'm recording — that it mattered. That someone noticed it existed.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "Thank you for looking. Really looking, not just glancing. I'm going to add today's date beside the orchid sketch. The day I shared it with someone.",
    },
  },
};

const lily_d3_high: DialogueScript = {
  id: 'lily_d3_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I want to read you something. From my journal. I wrote it last night and I haven't been able to stop thinking about it.",
      next: 'read',
    },
    read: {
      id: 'read',
      speaker: 'Lily',
      text: "*opens journal* 'There is a person here who makes me feel the way the forest does — like I can be still, and that's enough. I didn't know people could feel like a place.'",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "*closes the journal slowly* ...That's about you. In case that wasn't obvious. I'm not always good at saying things directly.",
      choices: [
        {
          text: '"You just said it perfectly. I feel the same way."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"That\'s one of the most beautiful things anyone\'s said to me."',
          next: 'moved',
          effects: { relationship_level: 9 },
        },
        {
          text: '"I\'m really glad you shared that."',
          next: 'gentle',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "You feel it too? *voice barely above a whisper* I was so afraid to read that out loud. But the forest teaches you — the things that scare you to say are usually the truest.",
      next: 'end',
    },
    moved: {
      id: 'moved',
      speaker: 'Lily',
      text: "*tears forming but smiling* I'm a better writer than speaker. My journal holds all the things I'm too quiet to say. But you... you make me want to say them aloud.",
      next: 'end',
    },
    gentle: {
      id: 'gentle',
      speaker: 'Lily',
      text: "I'm glad too. I almost didn't. I revised it four times and considered tearing the page out. But some truths are too important to erase, even imperfect ones.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I'm going to leave this page in, ink smudges and all. A perfect record of an imperfect, honest moment. The most important entry I've ever written.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 4 — Talks about the fortune-teller, what she's searching for
// ──────────────────────────────────────────────

const lily_d4_low: DialogueScript = {
  id: 'lily_d4_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I suppose you're wondering why a frog who talks to plants ended up on a dating show. *small laugh* It's a fair question.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "A fortune-teller in the market near my lily pad told me that my next chapter begins on an island. So... here I am. Following a stranger's words into the unknown.",
      choices: [
        {
          text: '"That takes real courage — trusting your instincts like that."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Do you really believe in fortune-telling?"',
          next: 'curious',
          effects: { relationship_level: 3 },
        },
        {
          text: '"That\'s a wild reason to come to an island."',
          next: 'skeptical',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "Instincts. That's what the forest runs on, isn't it? Seeds don't question where the wind takes them. Maybe I'm learning to do the same.",
      next: 'end',
    },
    curious: {
      id: 'curious',
      speaker: 'Lily',
      text: "I believe the universe speaks to those who listen. Whether through a fortune-teller or a bird's song or the way moss grows — the message finds you.",
      next: 'end',
    },
    skeptical: {
      id: 'skeptical',
      speaker: 'Lily',
      text: "Wild. *considers the word* Maybe. But the wildest things in nature are usually the most purposeful. I'm trusting the process.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "The fortune-teller also said I'd know my answer when I found something growing where nothing should. I'm still looking.",
    },
  },
};

const lily_d4_mid: DialogueScript = {
  id: 'lily_d4_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Can I tell you the full story? About why I came here? I've been wanting to tell someone, and you feel... safe.",
      next: 'story',
    },
    story: {
      id: 'story',
      speaker: 'Lily',
      text: "There was a fortune-teller in the market. She looked at my palm and said, 'Your roots go deep, little frog, but you've never let another soul into your garden. Your next chapter begins on an island, if you're brave enough.'",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "She was right about the first part. I've always been better with plants than people. They don't leave. They don't judge. They just... grow beside you.",
      choices: [
        {
          text: '"Maybe what you\'re searching for isn\'t a thing — it\'s a person willing to grow beside you."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"People can be like that too, if you let them in."',
          next: 'hopeful',
          effects: { relationship_level: 6 },
        },
        {
          text: '"I get why plants feel safer."',
          next: 'empathetic',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*hand goes to her heart* Grow beside me. That's... exactly it. That's what I'm looking for. Someone who doesn't try to uproot me, just... shares the soil.",
      next: 'end',
    },
    hopeful: {
      id: 'hopeful',
      speaker: 'Lily',
      text: "Let them in. *looks at you thoughtfully* I'm trying. It's harder than anything I've done in the forest. But I think... I think I'm starting to.",
      next: 'end',
    },
    empathetic: {
      id: 'empathetic',
      speaker: 'Lily',
      text: "They do. Plants never ask you to be more than you are. But the fortune-teller's point was that I can't live my whole life in a garden. Someday you have to step out.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "Thank you for listening to my strange little story. The fortune-teller said I'd know when the next chapter truly began. I think... maybe it already has.",
    },
  },
};

const lily_d4_high: DialogueScript = {
  id: 'lily_d4_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I haven't told anyone the last thing the fortune-teller said. The part that scared me. But I want to tell you.",
      next: 'secret',
    },
    secret: {
      id: 'secret',
      speaker: 'Lily',
      text: "She said, 'You will find someone who feels like rain after a drought. And it will terrify you, because to love something that can leave is the bravest thing a gardener can do.'",
      next: 'vulnerable',
    },
    vulnerable: {
      id: 'vulnerable',
      speaker: 'Lily',
      text: "*voice trembling* Plants don't leave. Flowers don't choose to stop growing beside you. But people... people can walk away. And that's what I've always been afraid of.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "Being here with you feels like rain after a drought. And she was right. It terrifies me.",
      choices: [
        {
          text: '"I\'m not going anywhere. Not unless you ask me to."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"Being scared means it matters. And that\'s a good thing."',
          next: 'wise',
          effects: { relationship_level: 9 },
        },
        {
          text: '"Thank you for trusting me with that."',
          next: 'grateful',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*tears fall quietly* The fortune-teller said I'd know. And I do. You feel like rain. Like something I've been waiting for without knowing I was waiting.",
      next: 'end',
    },
    wise: {
      id: 'wise',
      speaker: 'Lily',
      text: "It matters. *whispers* More than any flower I've ever found. More than any page in my journal. You're right — the fear means it's real.",
      next: 'end',
    },
    grateful: {
      id: 'grateful',
      speaker: 'Lily',
      text: "Trust. *considers the word* That's what it is, isn't it? I gave my trust to the forest years ago. Giving it to a person... this is new. But it feels right.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "The fortune-teller was right about everything. The island, the chapter, the rain. Now I just have to be brave enough to stay in the storm.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 5 — Lets guard down, shows sillier/lighter side
// ──────────────────────────────────────────────

const lily_d5_low: DialogueScript = {
  id: 'lily_d5_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I just caught myself humming. I don't hum. At least, I thought I didn't. This island is doing strange things to me.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "I also... may have named the gecko that lives near my window. His name is Professor Fernsworth. I'm not proud of it. Actually, I am a little.",
      choices: [
        {
          text: '"Professor Fernsworth is an excellent name."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"That\'s pretty cute, Lily."',
          next: 'charmed',
          effects: { relationship_level: 3 },
        },
        {
          text: '"You named a gecko?"',
          next: 'surprised',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*genuine laugh* He has these tiny spectacle markings around his eyes! How could I NOT call him Professor? He looks very academic!",
      next: 'end',
    },
    charmed: {
      id: 'charmed',
      speaker: 'Lily',
      text: "Cute? I suppose it is. *small grin* I'm not usually the 'cute' type. I'm more the 'sitting alone in moss reading about lichen' type. But this island is... loosening something.",
      next: 'end',
    },
    surprised: {
      id: 'surprised',
      speaker: 'Lily',
      text: "I name most things, actually. The tree outside the villa is Gerald. The particularly aggressive hermit crab is Duchess. ...I should probably keep that to myself.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I should get back to the Professor. We have a very important appointment involving a leaf and a sunbeam. Scholarly matters.",
    },
  },
};

const lily_d5_mid: DialogueScript = {
  id: 'lily_d5_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Okay, so — *trying to suppress a grin* — something happened this morning and I have to tell someone or I'll burst.",
      next: 'story',
    },
    story: {
      id: 'story',
      speaker: 'Lily',
      text: "I was talking to the frangipani tree — which is normal for me, don't judge — and a parrot landed on it and TALKED BACK. I nearly fell off my log!",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "*actually laughing* It said 'lovely morning!' and I said 'yes it is!' and then we just... stared at each other. I've never had a conversation go so well with another species!",
      choices: [
        {
          text: '"I love seeing you laugh like this. You should do it more."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That\'s amazing! What happened next?"',
          next: 'eager',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Only you would befriend a parrot by accident."',
          next: 'teasing',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*blush deepens* Laugh more? I... I didn't used to laugh much at all. You and this island and apparently a very polite parrot are changing that.",
      next: 'end',
    },
    eager: {
      id: 'eager',
      speaker: 'Lily',
      text: "It flew away! And I sat there grinning like a fool for five whole minutes! I wrote the entire conversation in my journal. Both lines of it!",
      next: 'end',
    },
    teasing: {
      id: 'teasing',
      speaker: 'Lily',
      text: "*mock-offended* By accident?! I'll have you know that was YEARS of interspecies communication training! ...Okay, it was a complete accident. But a beautiful one!",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I've named the parrot Wordsworth, naturally. We have a standing appointment tomorrow morning. I hope it shows up. *giggles* I just giggled. What is happening to me?",
    },
  },
};

const lily_d5_high: DialogueScript = {
  id: 'lily_d5_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "*splashing at the water's edge, laughing* Oh! You caught me! I was — *laughs harder* — I was trying to catch minnows with my hands like I used to as a tadpole!",
      next: 'playful',
    },
    playful: {
      id: 'playful',
      speaker: 'Lily',
      text: "I haven't done this in YEARS! I used to spend whole afternoons like this. Before I decided I was too serious and contemplative for splashing. What a ridiculous decision that was.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "*kicks water playfully* Want to join me? Fair warning — I will absolutely splash you and I will NOT apologize!",
      choices: [
        {
          text: '"You\'re radiant right now. I wouldn\'t miss this for anything."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"Get ready, because I\'m an EXCELLENT splasher."',
          next: 'playful_back',
          effects: { relationship_level: 9 },
        },
        {
          text: '"I\'ll watch from here and enjoy the show."',
          next: 'observing',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "Radiant? *stops splashing, genuinely stunned* I'm standing in ankle-deep water with mud on my face and you call me radiant? ...I think that's the nicest thing that's ever happened to me.",
      next: 'end',
    },
    playful_back: {
      id: 'playful_back',
      speaker: 'Lily',
      text: "*SPLASH* HA! Take THAT! *laughing uncontrollably* Oh my goodness — I can't remember the last time I laughed this hard! The forest never warns you that joy can hit you like a wave!",
      next: 'end',
    },
    observing: {
      id: 'observing',
      speaker: 'Lily',
      text: "*splashes happily* You know, the old me would have been mortified that anyone saw this. But with you... I don't mind at all. It's like being seen and being safe at the same time.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "*wringing water from her sleeves, still grinning* I'm writing this in my journal tonight. 'Day five: remembered how to play.' Thank you for that.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 6 — Deep nature metaphor about connections and roots
// ──────────────────────────────────────────────

const lily_d6_low: DialogueScript = {
  id: 'lily_d6_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Did you know that trees in a forest share nutrients through their roots? They feed each other underground where nobody can see.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "I've been thinking about that a lot. How the most important connections happen where nobody's watching.",
      choices: [
        {
          text: '"That\'s a beautiful way to think about relationships."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"You always find the perfect metaphor."',
          next: 'appreciative',
          effects: { relationship_level: 3 },
        },
        {
          text: '"I didn\'t know that about trees."',
          next: 'learning',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "Relationships. *nods slowly* I suppose that's what I'm really talking about, isn't it? The quiet, invisible ways we hold each other up.",
      next: 'end',
    },
    appreciative: {
      id: 'appreciative',
      speaker: 'Lily',
      text: "The forest provides them. I just listen. Every root system, every symbiotic pair — they're all love stories, if you think about it.",
      next: 'end',
    },
    learning: {
      id: 'learning',
      speaker: 'Lily',
      text: "There's so much happening beneath the surface that we never see. In forests. In people. In... everything, really.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I wonder sometimes if I've started putting down roots here. Quietly, underground, where I haven't noticed yet.",
    },
  },
};

const lily_d6_mid: DialogueScript = {
  id: 'lily_d6_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I found something this morning that I need to show you. Come with me — it's by the old banyan tree near the lagoon.",
      next: 'show',
    },
    show: {
      id: 'show',
      speaker: 'Lily',
      text: "*points to two vines wrapped gently around each other, spiralling upward toward the canopy* See how they grow? Neither one is pulling the other down. They spiral upward together. Each one stronger because of the other.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "That's what I want. Not someone who needs me to survive — or who I need to survive. Just... two things choosing to grow in the same direction.",
      choices: [
        {
          text: '"I think we\'re already doing that."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That\'s a really healthy way to see connection."',
          next: 'thoughtful',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Those vines are beautiful."',
          next: 'simple',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*reaches out and gently touches one of the vines* ...I think we are too. And I think that's why I brought you here. Not to explain what I want, but to show you what we already have.",
      next: 'end',
    },
    thoughtful: {
      id: 'thoughtful',
      speaker: 'Lily',
      text: "Healthy. *soft laugh* I spent so long studying how plants connect that I forgot to learn how people do. But this island is teaching me. You're teaching me.",
      next: 'end',
    },
    simple: {
      id: 'simple',
      speaker: 'Lily',
      text: "They are. And they've been here much longer than us. Growing together, season after season. There's a patience to it that I deeply admire.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I sketched them in my journal with two colours of ink — one for each vine. Separate, but intertwined. I think it might be my favourite page.",
    },
  },
};

const lily_d6_high: DialogueScript = {
  id: 'lily_d6_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I want to tell you something I've been thinking about. About roots. About us.",
      next: 'metaphor',
    },
    metaphor: {
      id: 'metaphor',
      speaker: 'Lily',
      text: "In the rainforest, the oldest trees send nutrients to saplings through underground networks. They feed things that haven't even broken through the soil yet. They invest in a future they can't see.",
      next: 'personal',
    },
    personal: {
      id: 'personal',
      speaker: 'Lily',
      text: "I've always been terrified of putting down roots with another person. Because roots mean staying. Roots mean you can't leave without tearing something apart.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "But with you... I feel my roots reaching. Without my permission, without my plan. Just reaching toward you like a vine toward sunlight. And for the first time, I don't want to stop them.",
      choices: [
        {
          text: '"Then don\'t. Let them grow. I\'m not going anywhere."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"I feel the same pull. Like something natural and inevitable."',
          next: 'mutual',
          effects: { relationship_level: 9 },
        },
        {
          text: '"That\'s one of the most vulnerable things you\'ve ever said."',
          next: 'recognizing',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*takes your hand* Do you know what happens when two root systems intertwine? They become stronger than either one alone. Storms that would topple one tree can't touch two that are connected.",
      next: 'end',
    },
    mutual: {
      id: 'mutual',
      speaker: 'Lily',
      text: "Natural and inevitable. *breathes* Yes. That's what the forest would call it. Not forced, not planned. Just... right. The way water finds its path downhill.",
      next: 'end',
    },
    recognizing: {
      id: 'recognizing',
      speaker: 'Lily',
      text: "It is. My hands are shaking, see? *holds them up* The fortune-teller was right — loving something that can leave is the bravest thing. But I choose it. I choose this.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "The forest has all the answers. And right now it's telling me that the strongest, most beautiful things grow when you're brave enough to stay rooted beside someone. I'm staying.",
    },
  },
};

// ──────────────────────────────────────────────
// Day 7 — Pre-ceremony reflection, reads fortune from nature
// ──────────────────────────────────────────────

const lily_d7_low: DialogueScript = {
  id: 'lily_d7_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "The ceremony is tonight. I've been sitting with the banyan tree all morning, asking it what to do. It hasn't answered yet. Typical.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "I read the nature signs this morning, though. The wind is blowing east, toward new things. And the tide pool had a perfect starfish in it. Five points. A good omen.",
      choices: [
        {
          text: '"If nature says it\'s a good sign, I trust your reading."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"I hope you find what you\'re looking for, Lily."',
          next: 'kind',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Good luck tonight."',
          next: 'brief',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "You trust my reading? *surprised smile* Most people think I'm being fanciful. But the signs are real to me. Thank you for not dismissing that.",
      next: 'end',
    },
    kind: {
      id: 'kind',
      speaker: 'Lily',
      text: "Thank you. I think the island already gave me more than I expected. Whatever happens tonight... I grew. Like a seed that finally found water.",
      next: 'end',
    },
    brief: {
      id: 'brief',
      speaker: 'Lily',
      text: "Luck. *nods* The forest doesn't believe in luck, but I'll take all the good wishes I can get.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "I'm going to press one last flower before tonight. Whatever happens, I want to remember this island exactly as it is right now.",
    },
  },
};

const lily_d7_mid: DialogueScript = {
  id: 'lily_d7_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "Before the ceremony, I did something. I read the nature signs for you. For us. I hope that's okay.",
      next: 'reading',
    },
    reading: {
      id: 'reading',
      speaker: 'Lily',
      text: "The wind this morning came from the south — that means warmth and patience. The first bird I heard was a dove, which means peace. And there was a rainbow in the waterfall mist at dawn.",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "The island is saying good things. Gentle things. About beginnings that don't rush, about connections that unfold slowly. Like petals.",
      choices: [
        {
          text: '"I love that you did this. It means everything."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"That sounds like a really hopeful reading."',
          next: 'hopeful',
          effects: { relationship_level: 6 },
        },
        {
          text: '"What does your heart say?"',
          next: 'direct',
          effects: { relationship_level: 5 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "Everything. *eyes glisten* I woke up before the sun for you. I sat in the dark and I listened for you. Because you're worth that kind of quiet attention.",
      next: 'end',
    },
    hopeful: {
      id: 'hopeful',
      speaker: 'Lily',
      text: "Hopeful. Yes. This whole week has been hopeful. I came looking for a chapter and I think I found a whole new story.",
      next: 'end',
    },
    direct: {
      id: 'direct',
      speaker: 'Lily',
      text: "My heart? *places hand on chest* My heart says the same thing the wind said. Warmth. Patience. The beginning of something that will grow for a long time.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "The forest has all the answers, if you listen. And tonight, I'm going to listen to what it tells me one last time. I think it's going to say your name.",
    },
  },
};

const lily_d7_high: DialogueScript = {
  id: 'lily_d7_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Lily',
      text: "I need to show you something before the ceremony. My journal. The last page.",
      next: 'journal',
    },
    journal: {
      id: 'journal',
      speaker: 'Lily',
      text: "*opens to the final page — it's covered in pressed flowers, small sketches, and careful handwriting* I wrote your fortune. From every sign the island has given me this week. All of them. Together.",
      next: 'fortune',
    },
    fortune: {
      id: 'fortune',
      speaker: 'Lily',
      text: "*reads quietly* 'The east wind brought you here. The ghost orchid taught you that needing someone isn't weakness. The minnows reminded you to play. And the two vines showed you that growing beside someone is the bravest, most beautiful thing a heart can do.'",
      next: 'choice1',
    },
    choice1: {
      id: 'choice1',
      speaker: 'Lily',
      text: "*looks up with tears on her cheeks* That's your fortune. And mine. Written in flowers and wind and the language of a frog who finally found something worth putting down roots for.",
      choices: [
        {
          text: '"I have never been more certain of anything. You\'re my answer too."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"That\'s the most beautiful thing anyone has ever given me."',
          next: 'moved',
          effects: { relationship_level: 10 },
        },
        {
          text: '"Lily... I don\'t have the words. But I feel everything you wrote."',
          next: 'speechless',
          effects: { relationship_level: 8 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Lily',
      text: "*takes both your hands in hers* The fortune-teller said my next chapter begins on an island. She was wrong. My next chapter begins with you. The island was just where we met.",
      next: 'end',
    },
    moved: {
      id: 'moved',
      speaker: 'Lily',
      text: "*presses the journal gently into your hands* Then keep it. The whole journal. Every flower, every sketch, every word. It was always leading to you. I see that now.",
      next: 'end',
    },
    speechless: {
      id: 'speechless',
      speaker: 'Lily',
      text: "You don't need words. *soft smile through tears* The forest doesn't use words and it says more than anyone. Your silence right now is the most beautiful thing I've ever heard.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Lily',
      text: "Let's go to the ceremony. And whatever happens after tonight... the forest has all the answers. And right now, every single one of them is you.",
    },
  },
};

// ──────────────────────────────────────────────
// Export: 7 days × 3 tiers = 21 scripts
// ──────────────────────────────────────────────

export const LILY_DAILY: DialogueScript[][] = [
  // Day 1
  [lily_d1_low, lily_d1_mid, lily_d1_high],
  // Day 2
  [lily_d2_low, lily_d2_mid, lily_d2_high],
  // Day 3
  [lily_d3_low, lily_d3_mid, lily_d3_high],
  // Day 4
  [lily_d4_low, lily_d4_mid, lily_d4_high],
  // Day 5
  [lily_d5_low, lily_d5_mid, lily_d5_high],
  // Day 6
  [lily_d6_low, lily_d6_mid, lily_d6_high],
  // Day 7
  [lily_d7_low, lily_d7_mid, lily_d7_high],
];

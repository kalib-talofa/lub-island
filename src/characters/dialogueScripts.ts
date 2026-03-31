import { DialogueScript } from '@/utils/ink';

// ---------------------------------------------------------------------------
// ROSIE -- The pun-loving rabbit, romantic interest
// ---------------------------------------------------------------------------

const rosie_chat_low: DialogueScript = {
  id: 'rosie_chat_low',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Rosie',
      text: 'Oh! Hi there. I was just trying to decide if this flower is a daisy or a "crazy" -- because it keeps growing sideways.',
      next: 'greet2',
    },
    greet2: {
      id: 'greet2',
      speaker: 'Rosie',
      text: "Sorry, that was terrible. I promise my puns get better once you get to know me. ...Actually, no they don't.",
      choices: [
        {
          text: '"I thought it was pretty bunny -- I mean funny."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm to land a counter-pun.',
          next: 'smooth_reply',
          effects: { relationship: 8 },
        },
        {
          text: '"Puns are the highest form of comedy. Fight me."',
          next: 'friendly_reply',
          effects: { relationship: 5 },
        },
        {
          text: '"I have no idea how to respond to that."',
          next: 'awkward_reply',
          effects: { relationship: 2 },
        },
      ],
    },
    smooth_reply: {
      id: 'smooth_reply',
      speaker: 'Rosie',
      text: (v) => `*ears perk up* Did you just... out-pun me? On our first real conversation? I think I'm in love. ...Kidding! Mostly.`,
      next: 'garden_talk',
    },
    friendly_reply: {
      id: 'friendly_reply',
      speaker: 'Rosie',
      text: "A fellow pun enthusiast! You have NO idea what you've just signed up for. I have a whole notebook.",
      next: 'garden_talk',
    },
    awkward_reply: {
      id: 'awkward_reply',
      speaker: 'Rosie',
      text: "Ha! That's the usual reaction. Don't worry, you'll build up a tolerance. Like a pun vaccine.",
      next: 'garden_talk',
    },
    garden_talk: {
      id: 'garden_talk',
      speaker: 'Rosie',
      text: "Anyway, I've been spending a lot of time in the garden. There's something about watching things grow that just... calms the nerves, you know?",
      choices: [
        {
          text: '"What are you growing?"',
          next: 'growing',
          effects: { relationship: 3 },
        },
        {
          text: '"Nervous about being on the island?"',
          next: 'nervous',
          effects: { relationship: 4 },
        },
      ],
    },
    growing: {
      id: 'growing',
      speaker: 'Rosie',
      text: "Carrots, obviously. A rabbit's gotta stay on brand. But also some wildflowers -- I'm trying to recreate the meadow I grew up near. It's silly, I know.",
      next: 'end_warm',
    },
    nervous: {
      id: 'nervous',
      speaker: 'Rosie',
      text: "A little, yeah. Everyone here is so... much. Blaze is intense, Kiki barely talks to me, and Sprocket won't stop doing impressions. It's nice to just have a normal chat.",
      next: 'end_warm',
    },
    end_warm: {
      id: 'end_warm',
      speaker: 'Rosie',
      text: "Thanks for talking to me. I mean it. Come find me in the garden anytime -- I'll have fresh puns and fresh carrots. Emphasis on the puns.",
    },
  },
};

const rosie_chat_mid: DialogueScript = {
  id: 'rosie_chat_mid',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Rosie',
      text: (v) => `Hey you! I was just thinking about you. Not in a weird way! In a perfectly normal, non-obsessive way. ...Okay that sounded worse.`,
      next: 'greet2',
    },
    greet2: {
      id: 'greet2',
      speaker: 'Rosie',
      text: "I made carrot cake this morning and saved you a slice. Pudge helped with the frosting -- that bear is a wizard in the kitchen.",
      choices: [
        {
          text: '"You were thinking about me, huh? Should I be flattered or concerned?"',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm for the flirty deflection.',
          next: 'flirty_response',
          effects: { relationship: 10 },
        },
        {
          text: '"Carrot cake AND good company? Best day on the island so far."',
          next: 'warm_response',
          effects: { relationship: 7 },
        },
        {
          text: '"Thanks, I love cake."',
          next: 'plain_response',
          effects: { relationship: 3 },
        },
      ],
    },
    flirty_response: {
      id: 'flirty_response',
      speaker: 'Rosie',
      text: "*turns bright pink* Both? Definitely both. I -- okay, moving on! Let's talk about literally anything else before my ears catch fire.",
      next: 'deeper_talk',
    },
    warm_response: {
      id: 'warm_response',
      speaker: 'Rosie',
      text: "Aww, stop it. You're going to make a bunny blush. ...Too late. Already blushing. Classic Rosie.",
      next: 'deeper_talk',
    },
    plain_response: {
      id: 'plain_response',
      speaker: 'Rosie',
      text: "Great! Cake is great. Yep. Just two friends eating cake. Normal island stuff.",
      next: 'deeper_talk',
    },
    deeper_talk: {
      id: 'deeper_talk',
      speaker: 'Rosie',
      text: "Can I be honest with you? I wrote love letters for years back home and never sent a single one. I was always too scared. Being here is kind of forcing me to be braver.",
      choices: [
        {
          text: '"What were you afraid of?"',
          next: 'fear_talk',
          effects: { relationship: 6 },
        },
        {
          text: '"You seem pretty brave to me."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm to be reassuring.',
          next: 'brave_talk',
          effects: { relationship: 8 },
        },
        {
          text: '"That takes guts. I respect it."',
          next: 'respect_talk',
          effects: { relationship: 5 },
        },
      ],
    },
    fear_talk: {
      id: 'fear_talk',
      speaker: 'Rosie',
      text: "That the words wouldn't be enough. That I'd pour my whole heart onto a page and the other person would just go '...cool, thanks.' You know?",
      next: 'end_mid',
    },
    brave_talk: {
      id: 'brave_talk',
      speaker: 'Rosie',
      text: "*laughs softly* You say that, but you haven't seen me try to make eye contact during a ceremony. I stare at my feet like they're the most interesting thing on the planet.",
      next: 'end_mid',
    },
    respect_talk: {
      id: 'respect_talk',
      speaker: 'Rosie',
      text: "Thanks. I think this island is good for me. Terrifying, but good. Like eating a really spicy carrot.",
      next: 'end_mid',
    },
    end_mid: {
      id: 'end_mid',
      speaker: 'Rosie',
      text: "Okay, enough feelings. Want to hear the worst pun I've ever written? Too bad, here it is: what do you call a rabbit who tells jokes? A funny bunny. ...I'll see myself out.",
    },
  },
};

const rosie_chat_high: DialogueScript = {
  id: 'rosie_chat_high',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Rosie',
      text: "*runs up* There you are! I've been looking everywhere. Well, everywhere in the garden. Which is the only place I ever am, so that checks out.",
      next: 'greet2',
    },
    greet2: {
      id: 'greet2',
      speaker: 'Rosie',
      text: "I wanted to show you something. I finally finished the wildflower patch -- the one I've been working on since day one. It bloomed this morning.",
      choices: [
        {
          text: '"Show me. I want to see it through your eyes."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm for this heartfelt response.',
          next: 'romantic_show',
          effects: { relationship: 12 },
        },
        {
          text: '"That is amazing! All that work paid off."',
          next: 'happy_show',
          effects: { relationship: 7 },
        },
        {
          text: '"Nice! Flowers are cool."',
          next: 'flat_show',
          effects: { relationship: 3 },
        },
      ],
    },
    romantic_show: {
      id: 'romantic_show',
      speaker: 'Rosie',
      text: "*stops walking* ...Through my eyes? Nobody's ever said that to me before. Usually people just say 'oh pretty' and move on. You actually want to understand why it matters.",
      next: 'garden_moment',
    },
    happy_show: {
      id: 'happy_show',
      speaker: 'Rosie',
      text: "It really did! Come on, come on -- you have to smell the lavender. I planted it specifically because Lily said it attracts butterflies.",
      next: 'garden_moment',
    },
    flat_show: {
      id: 'flat_show',
      speaker: 'Rosie',
      text: "...Yeah. Flowers are cool. Super cool. The coolest. *sigh* Come on, you goofball.",
      next: 'garden_moment',
    },
    garden_moment: {
      id: 'garden_moment',
      speaker: 'Rosie',
      text: "You know what I realized? I stopped writing unsent love letters since I got here. I think it's because... I don't need to imagine conversations anymore. I have real ones now.",
      choices: [
        {
          text: '"Maybe you could write one more. A sent one, this time."',
          condition: (v) => v.charm >= 70,
          lockMessage: 'Needs 70 charm for the big romantic move.',
          next: 'love_letter',
          effects: { relationship: 15 },
        },
        {
          text: '"That means a lot, Rosie."',
          next: 'sweet_end',
          effects: { relationship: 8 },
        },
      ],
    },
    love_letter: {
      id: 'love_letter',
      speaker: 'Rosie',
      text: "*ears go completely flat, face crimson* Are you... asking me to write you a love letter? Because I already have three drafts and I was REALLY hoping you wouldn't find out about that.",
      next: 'end_high',
    },
    sweet_end: {
      id: 'sweet_end',
      speaker: 'Rosie',
      text: "It means a lot to me too. More than any pun I could ever make. And that is saying something because I know roughly four thousand puns.",
      next: 'end_high',
    },
    end_high: {
      id: 'end_high',
      speaker: 'Rosie',
      text: "Hey. Whatever happens on this island... thanks for seeing me. Not just the puns and the carrots, but... me. Okay! Feelings over! Let's go get snacks before Pudge eats them all.",
    },
  },
};

// ---------------------------------------------------------------------------
// BLAZE -- The calculating fox, competitive rival
// ---------------------------------------------------------------------------

const blaze_chat_low: DialogueScript = {
  id: 'blaze_chat_low',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Blaze',
      text: "Well, well. The new arrival decides to grace me with their presence. I was starting to think you were avoiding the competition.",
      choices: [
        {
          text: '"Competition? I thought this was a dating show, not a cage match."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm to trade verbal jabs with Blaze.',
          next: 'witty_comeback',
          effects: { relationship: 6 },
        },
        {
          text: '"Just being friendly. We\'re all in this together."',
          next: 'naive_response',
          effects: { relationship: 2 },
        },
        {
          text: '"I\'m not scared of you."',
          next: 'aggressive_response',
          effects: { relationship: -3 },
        },
      ],
    },
    witty_comeback: {
      id: 'witty_comeback',
      speaker: 'Blaze',
      text: "*smirks* Hm. You've got a mouth on you. Good. The boring ones get eliminated first. I should know -- I've been watching.",
      next: 'island_read',
    },
    naive_response: {
      id: 'naive_response',
      speaker: 'Blaze',
      text: "*laughs* Oh, that's adorable. 'All in this together.' Sure. Tell that to whoever gets voted off next week.",
      next: 'island_read',
    },
    aggressive_response: {
      id: 'aggressive_response',
      speaker: 'Blaze',
      text: "Scared? Nobody said anything about scared. But you just revealed you're thinking about it, which tells me everything I need to know.",
      next: 'island_read',
    },
    island_read: {
      id: 'island_read',
      speaker: 'Blaze',
      text: "Let me give you the lay of the land since I'm feeling generous. Rosie's a sweetheart but she'll crumble under pressure. Kiki's the real threat -- she's reading everyone like a book and nobody's noticed.",
      choices: [
        {
          text: '"And what about you? What\'s your play?"',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm to challenge Blaze directly.',
          next: 'his_play',
          effects: { relationship: 5 },
        },
        {
          text: '"Why are you telling me this?"',
          next: 'why_tell',
          effects: { relationship: 3 },
        },
      ],
    },
    his_play: {
      id: 'his_play',
      speaker: 'Blaze',
      text: "My play? I don't have a play. I have a strategy, several contingencies, and a backup plan for the backup plan. The question is: do you want to be part of it or in the way?",
      next: 'end_low',
    },
    why_tell: {
      id: 'why_tell',
      speaker: 'Blaze',
      text: "Because information is a gift, and gifts create debts. Remember that.",
      next: 'end_low',
    },
    end_low: {
      id: 'end_low',
      speaker: 'Blaze',
      text: "We'll talk again. Keep your ears open and your mouth shut around the others. That's free advice -- next time it costs something.",
    },
  },
};

const blaze_chat_mid: DialogueScript = {
  id: 'blaze_chat_mid',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Blaze',
      text: "You're still here. Good. I was starting to think you had potential, and I hate being wrong.",
      next: 'observation',
    },
    observation: {
      id: 'observation',
      speaker: 'Blaze',
      text: "I've been watching the alliances form. Rosie and Pudge are thick as thieves. Sprocket's trying to be everyone's friend, which means he's nobody's. Kiki... Kiki is doing exactly what I would do.",
      choices: [
        {
          text: '"You respect Kiki."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm to read Blaze accurately.',
          next: 'respect_kiki',
          effects: { relationship: 8 },
        },
        {
          text: '"Sounds like you\'re overthinking this."',
          next: 'overthinking',
          effects: { relationship: 3 },
        },
        {
          text: '"Where do I fit in your little chess game?"',
          next: 'chess_game',
          effects: { relationship: 5 },
        },
      ],
    },
    respect_kiki: {
      id: 'respect_kiki',
      speaker: 'Blaze',
      text: "*pauses* ...You're perceptive. Fine. Yes. She's the only one here who actually understands how the game works. Everyone else is playing checkers while she's three moves ahead.",
      next: 'vulnerability',
    },
    overthinking: {
      id: 'overthinking',
      speaker: 'Blaze',
      text: "Overthinking? No. Under-thinking is what gets you eliminated. I learned that the hard way growing up. Trust me.",
      next: 'vulnerability',
    },
    chess_game: {
      id: 'chess_game',
      speaker: 'Blaze',
      text: "You? You're the wildcard. I can read everyone else, but you keep surprising me. And I don't love surprises.",
      next: 'vulnerability',
    },
    vulnerability: {
      id: 'vulnerability',
      speaker: 'Blaze',
      text: "You know why I play the game so hard? Because where I came from, if you weren't the sharpest, you were prey. The forest doesn't hand out participation trophies.",
      choices: [
        {
          text: '"You\'re not in the forest anymore, Blaze."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm to get through to him.',
          next: 'breakthrough',
          effects: { relationship: 10 },
        },
        {
          text: '"That sounds rough."',
          next: 'sympathy',
          effects: { relationship: 5 },
        },
      ],
    },
    breakthrough: {
      id: 'breakthrough',
      speaker: 'Blaze',
      text: "*long pause* ...No. I guess I'm not. Doesn't mean the instinct just turns off, though.",
      next: 'end_mid',
    },
    sympathy: {
      id: 'sympathy',
      speaker: 'Blaze',
      text: "It was what it was. Made me who I am. Can't decide if that's a good thing or not.",
      next: 'end_mid',
    },
    end_mid: {
      id: 'end_mid',
      speaker: 'Blaze',
      text: "Don't go spreading this around. I have a reputation. ...And thanks. For listening. Don't make it weird.",
    },
  },
};

const blaze_chat_high: DialogueScript = {
  id: 'blaze_chat_high',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Blaze',
      text: "Hey. I saved you a spot. Don't read into it -- it just has the best view of the sunset, and I know you like sunsets because I'm observant, not sentimental.",
      next: 'greet2',
    },
    greet2: {
      id: 'greet2',
      speaker: 'Blaze',
      text: "Okay, maybe slightly sentimental. If you tell anyone, I'll deny it.",
      choices: [
        {
          text: '"Your secret is safe with me, tough guy."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm for the affectionate tease.',
          next: 'tease_response',
          effects: { relationship: 10 },
        },
        {
          text: '"I appreciate it, Blaze. Really."',
          next: 'sincere_response',
          effects: { relationship: 7 },
        },
      ],
    },
    tease_response: {
      id: 'tease_response',
      speaker: 'Blaze',
      text: "*actually laughs* Tough guy. Right. You're the only person here who's figured out it's an act. Well, mostly an act. The ambition is real.",
      next: 'real_talk',
    },
    sincere_response: {
      id: 'sincere_response',
      speaker: 'Blaze',
      text: "...Yeah. You're welcome. Sit down before I change my mind about being nice.",
      next: 'real_talk',
    },
    real_talk: {
      id: 'real_talk',
      speaker: 'Blaze',
      text: "I've been thinking. When the show ends... what happens? Everyone goes back to their lives and forgets about this place?",
      choices: [
        {
          text: '"Not if the connections are real."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm to reach Blaze on this level.',
          next: 'connections_real',
          effects: { relationship: 12 },
        },
        {
          text: '"Some things are worth holding onto."',
          next: 'worth_it',
          effects: { relationship: 8 },
        },
      ],
    },
    connections_real: {
      id: 'connections_real',
      speaker: 'Blaze',
      text: "Real. Yeah. I used to think 'real' was just a word people used to justify bad decisions. But... you make me reconsider a lot of things I thought I knew.",
      next: 'end_high',
    },
    worth_it: {
      id: 'worth_it',
      speaker: 'Blaze',
      text: "Since when did you become the philosophical one? That's supposed to be Lily's thing. But... yeah. Maybe some things are.",
      next: 'end_high',
    },
    end_high: {
      id: 'end_high',
      speaker: 'Blaze',
      text: "Alright, enough feelings. Blaze the fox does NOT do feelings. He does... strategic emotional investments. With acceptable risk profiles. ...Stop laughing.",
    },
  },
};

// ---------------------------------------------------------------------------
// PUDGE -- The shy bear, cooking enthusiast
// ---------------------------------------------------------------------------

const pudge_chat_low: DialogueScript = {
  id: 'pudge_chat_low',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Pudge',
      text: "Oh! You're -- hi! I didn't see you there. I was just, um... standing here. Looking at the wall. Normal stuff.",
      next: 'greet2',
    },
    greet2: {
      id: 'greet2',
      speaker: 'Pudge',
      text: "I'm Pudge. But you probably knew that. Unless you didn't? I'm sorry, should I have introduced myself sooner? I'm bad at this.",
      choices: [
        {
          text: '"Take a breath, big guy. I\'m just happy to chat."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm to put Pudge at ease.',
          next: 'calming',
          effects: { relationship: 8 },
        },
        {
          text: '"No worries! I\'m not great at this either."',
          next: 'relatable',
          effects: { relationship: 6 },
        },
        {
          text: '"You seem nervous."',
          next: 'pointed_out',
          effects: { relationship: 1 },
        },
      ],
    },
    calming: {
      id: 'calming',
      speaker: 'Pudge',
      text: "*exhales* Right. Breathing. Good tip. Sorry, I just... I've never been on a show before. My friends signed me up and I didn't have the heart to say no.",
      next: 'cooking_topic',
    },
    relatable: {
      id: 'relatable',
      speaker: 'Pudge',
      text: "Really? You seem so confident though! Like, you just walked up and started talking to me. I could never do that. I've been rehearsing 'hello' in my head for twenty minutes.",
      next: 'cooking_topic',
    },
    pointed_out: {
      id: 'pointed_out',
      speaker: 'Pudge',
      text: "I -- yeah. That's... accurate. *stares at feet* Is it obvious? It's obvious, isn't it.",
      next: 'cooking_topic',
    },
    cooking_topic: {
      id: 'cooking_topic',
      speaker: 'Pudge',
      text: "The one thing that helps is cooking. I made honey cakes this morning. They're, um, they're okay. Probably. I mean, Rosie said they were good but she says nice things about everything.",
      choices: [
        {
          text: '"Can I try one? I bet they\'re incredible."',
          next: 'try_cake',
          effects: { relationship: 7 },
        },
        {
          text: '"You should give yourself more credit."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm to be encouraging.',
          next: 'credit',
          effects: { relationship: 8 },
        },
      ],
    },
    try_cake: {
      id: 'try_cake',
      speaker: 'Pudge',
      text: "You -- really? Okay! *carefully unwraps a honey cake* They're my grandmother's recipe. She taught me everything I know about baking. ...I miss her kitchen.",
      next: 'end_low',
    },
    credit: {
      id: 'credit',
      speaker: 'Pudge',
      text: "*blinks* That's... really kind. Nobody's ever said that to me about cooking before. I mean, they say the food is good, but you're the first person to say I should believe it.",
      next: 'end_low',
    },
    end_low: {
      id: 'end_low',
      speaker: 'Pudge',
      text: "Thank you for, um, not making fun of me. Some of the others are so loud and confident and I just... freeze. But this was nice. Really nice.",
    },
  },
};

const pudge_chat_mid: DialogueScript = {
  id: 'pudge_chat_mid',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Pudge',
      text: "Oh good, it's you! I mean -- that came out more eager than I intended. But I made something and I wanted you to be the first to try it.",
      next: 'the_dish',
    },
    the_dish: {
      id: 'the_dish',
      speaker: 'Pudge',
      text: "It's a lavender honey glaze. Lily helped me find wild lavender in the jungle, and I mixed it with the honey from the villa pantry. I think it might be the best thing I've ever made.",
      choices: [
        {
          text: '"You\'re not even hiding your excitement. I love that."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm to appreciate his passion.',
          next: 'open_up',
          effects: { relationship: 10 },
        },
        {
          text: '"Hand it over. My taste buds are ready."',
          next: 'eager_taste',
          effects: { relationship: 6 },
        },
        {
          text: '"Sounds... fancy."',
          next: 'uncertain',
          effects: { relationship: 3 },
        },
      ],
    },
    open_up: {
      id: 'open_up',
      speaker: 'Pudge',
      text: "*covers face with paws* Am I being too much? I just -- when it's about food, the shyness kind of... disappears. It's the only time I feel like I know what I'm doing.",
      next: 'confidence_talk',
    },
    eager_taste: {
      id: 'eager_taste',
      speaker: 'Pudge',
      text: "*beaming* Okay, okay! Close your eyes. ...I don't know why I said that. You don't have to close your eyes. That's weird. Just eat it normally.",
      next: 'confidence_talk',
    },
    uncertain: {
      id: 'uncertain',
      speaker: 'Pudge',
      text: "Oh. Is fancy... bad? I can make something simpler. I have crackers. Crackers aren't fancy at all.",
      next: 'confidence_talk',
    },
    confidence_talk: {
      id: 'confidence_talk',
      speaker: 'Pudge',
      text: "Can I tell you something? I watch Blaze work the room and I think... how does he just DO that? Walk up to anyone, say anything, not care what they think. I would melt into the floor.",
      choices: [
        {
          text: '"You don\'t need to be Blaze. Pudge is pretty great."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm for the reassurance.',
          next: 'reassured',
          effects: { relationship: 10 },
        },
        {
          text: '"Confidence is overrated. Kindness is what matters."',
          next: 'kindness',
          effects: { relationship: 7 },
        },
      ],
    },
    reassured: {
      id: 'reassured',
      speaker: 'Pudge',
      text: "*sniffles* I'm not crying. It's the lavender. Lavender makes my eyes water. That's a real thing. Probably.",
      next: 'end_mid',
    },
    kindness: {
      id: 'kindness',
      speaker: 'Pudge',
      text: "You think so? Because my grandmother always said that too, but I thought she was just being nice because she's my grandmother.",
      next: 'end_mid',
    },
    end_mid: {
      id: 'end_mid',
      speaker: 'Pudge',
      text: "I'm going to make you something special tomorrow. Not because I have to! Because I want to. That's... that's different, right? Okay. Bye. I'm going to go be embarrassed now.",
    },
  },
};

const pudge_chat_high: DialogueScript = {
  id: 'pudge_chat_high',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Pudge',
      text: "Hey. *doesn't look away this time* I've been waiting for you. I know, I know -- old Pudge would never have said that out loud. Growth!",
      next: 'growth',
    },
    growth: {
      id: 'growth',
      speaker: 'Pudge',
      text: "I realized something. This whole time I've been apologizing for being nervous, but you never once asked me to be different. You just... let me be me. While also nudging me to be braver.",
      choices: [
        {
          text: '"You were always brave. You just needed someone to believe it."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm for the meaningful moment.',
          next: 'brave_moment',
          effects: { relationship: 12 },
        },
        {
          text: '"That\'s what friends are for."',
          next: 'friends',
          effects: { relationship: 6 },
        },
      ],
    },
    brave_moment: {
      id: 'brave_moment',
      speaker: 'Pudge',
      text: "*takes a deep breath* Okay. Brave Pudge. Here goes. I made you a recipe book. Every dish I've ever cooked for you, written down, with little notes about the day I made it.",
      next: 'gift_reaction',
    },
    friends: {
      id: 'friends',
      speaker: 'Pudge',
      text: "Friends. Yeah. The best kind. I, um -- I made you something. It's a recipe book. Of everything I've cooked on the island. With notes.",
      next: 'gift_reaction',
    },
    gift_reaction: {
      id: 'gift_reaction',
      speaker: 'Pudge',
      text: "The honey cake on day three has a note that says 'first person to say my food was more than okay.' ...I might have gotten a little emotional while writing it.",
      choices: [
        {
          text: '"This is the most thoughtful gift anyone has ever given me."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm to fully appreciate the gesture.',
          next: 'touched',
          effects: { relationship: 15 },
        },
        {
          text: '"Pudge... this is amazing."',
          next: 'amazed',
          effects: { relationship: 10 },
        },
      ],
    },
    touched: {
      id: 'touched',
      speaker: 'Pudge',
      text: "Really? Because I was terrified it was too much. Blaze said I was being 'aggressively wholesome.' I choose to take that as a compliment.",
      next: 'end_high',
    },
    amazed: {
      id: 'amazed',
      speaker: 'Pudge',
      text: "*biggest smile* You like it? I tried to draw little pictures of each dish but I'm not great at art. The honey cake looks like a blob. But a loving blob.",
      next: 'end_high',
    },
    end_high: {
      id: 'end_high',
      speaker: 'Pudge',
      text: "Whatever happens after this island, you've got a friend who will cook for you anytime. ...That's my version of a dramatic declaration. I know it's not much, but it's honest.",
    },
  },
};

// ---------------------------------------------------------------------------
// KIKI -- The mysterious cat, romantic interest
// ---------------------------------------------------------------------------

const kiki_chat_low: DialogueScript = {
  id: 'kiki_chat_low',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Kiki',
      text: "*looks up from shuffling tarot cards* Hmm. You came to me. Interesting. Most people wait for me to come to them. I never do.",
      choices: [
        {
          text: '"Maybe I\'m not most people."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm to intrigue Kiki.',
          next: 'intrigued',
          effects: { relationship: 8 },
        },
        {
          text: '"I\'m just saying hi."',
          next: 'casual_hi',
          effects: { relationship: 2 },
        },
        {
          text: '"Those cards real or just for show?"',
          next: 'cards_question',
          effects: { relationship: 4 },
        },
      ],
    },
    intrigued: {
      id: 'intrigued',
      speaker: 'Kiki',
      text: "*tilts head* Bold claim. But confidence without substance is just noise. Show me something real and we'll talk.",
      next: 'reading_offer',
    },
    casual_hi: {
      id: 'casual_hi',
      speaker: 'Kiki',
      text: "Just saying hi. How refreshingly boring. ...I don't mean that as an insult. Straightforward people are rare here.",
      next: 'reading_offer',
    },
    cards_question: {
      id: 'cards_question',
      speaker: 'Kiki',
      text: "Real? That depends on what you mean by real. The cards don't tell the future. They tell you what you already know but refuse to admit.",
      next: 'reading_offer',
    },
    reading_offer: {
      id: 'reading_offer',
      speaker: 'Kiki',
      text: "I'll read one card for you. Free of charge. Consider it a... getting-to-know-you exercise.",
      choices: [
        {
          text: '"Sure. What do the cards say about me?"',
          next: 'card_reading',
          effects: { relationship: 5 },
        },
        {
          text: '"I\'d rather get to know the real you, not the cards."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm to see past the mystique.',
          next: 'real_kiki',
          effects: { relationship: 10 },
        },
      ],
    },
    card_reading: {
      id: 'card_reading',
      speaker: 'Kiki',
      text: "*flips a card* The Wanderer. It means you're searching for something, but you're not sure what yet. Sound familiar? Don't answer -- I already know.",
      next: 'end_low',
    },
    real_kiki: {
      id: 'real_kiki',
      speaker: 'Kiki',
      text: "*actually blinks in surprise* ...That's a new one. Most people love the mysterious act. You just walked right past it. I'm not sure if I'm impressed or annoyed.",
      next: 'end_low',
    },
    end_low: {
      id: 'end_low',
      speaker: 'Kiki',
      text: "This was... unexpected. Come back when you have something interesting to say. Or don't. Curiosity should never be forced.",
    },
  },
};

const kiki_chat_mid: DialogueScript = {
  id: 'kiki_chat_mid',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Kiki',
      text: "*sitting on the beach at night* Pull up some sand. I was just watching the waves pretend to be unpredictable. They're not, of course. Nothing really is.",
      next: 'observation',
    },
    observation: {
      id: 'observation',
      speaker: 'Kiki',
      text: "I've figured out everyone on this island. Rosie's an open book -- literally, she keeps a journal on the kitchen counter. Blaze is smart but predictable. Pudge will do anything for approval. Sprocket's jokes are armor. Lily talks to plants because animals have disappointed her.",
      choices: [
        {
          text: '"And what have you figured out about me?"',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm to turn the question around.',
          next: 'about_you',
          effects: { relationship: 8 },
        },
        {
          text: '"That\'s kind of harsh."',
          next: 'harsh',
          effects: { relationship: 2 },
        },
        {
          text: '"What about yourself? Have you figured you out?"',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm to challenge Kiki this directly.',
          next: 'about_herself',
          effects: { relationship: 10 },
        },
      ],
    },
    about_you: {
      id: 'about_you',
      speaker: 'Kiki',
      text: "You? ...You're the one I haven't figured out. And I've been trying. It's infuriating. In a good way. Mostly.",
      next: 'backstory_hint',
    },
    harsh: {
      id: 'harsh',
      speaker: 'Kiki',
      text: "Harsh? Or honest? People get those confused constantly. I'd rather someone be honest with me than kind. Kindness without honesty is just manipulation with better marketing.",
      next: 'backstory_hint',
    },
    about_herself: {
      id: 'about_herself',
      speaker: 'Kiki',
      text: "*silence for a long moment* ...No. I haven't. And that's the most honest thing I've said on this island. Congratulations. You broke through a wall I didn't know I had.",
      next: 'backstory_hint',
    },
    backstory_hint: {
      id: 'backstory_hint',
      speaker: 'Kiki',
      text: "I read tarot on street corners for years. You learn to read people fast when your next meal depends on it. But somewhere along the way, I forgot how to let people read me.",
      choices: [
        {
          text: '"You don\'t have to perform for me."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm to offer genuine connection.',
          next: 'no_perform',
          effects: { relationship: 10 },
        },
        {
          text: '"That sounds lonely."',
          next: 'lonely',
          effects: { relationship: 6 },
        },
      ],
    },
    no_perform: {
      id: 'no_perform',
      speaker: 'Kiki',
      text: "*looks away* You keep saying things that disarm me. It's extremely inconvenient for my whole 'mysterious and untouchable' brand.",
      next: 'end_mid',
    },
    lonely: {
      id: 'lonely',
      speaker: 'Kiki',
      text: "Lonely is a strong word. I prefer... deliberately alone. It sounds more intentional and less pathetic.",
      next: 'end_mid',
    },
    end_mid: {
      id: 'end_mid',
      speaker: 'Kiki',
      text: "The moon's getting high. I should go. But... this was good. Don't expect me to say that often.",
    },
  },
};

const kiki_chat_high: DialogueScript = {
  id: 'kiki_chat_high',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Kiki',
      text: "*waiting at the usual spot* Before you say anything -- yes, I was waiting for you. No, I'm not going to pretend I wasn't. I'm tired of pretending.",
      next: 'vulnerable',
    },
    vulnerable: {
      id: 'vulnerable',
      speaker: 'Kiki',
      text: "I came to this island thinking nobody could hold my attention. That I'd get bored, cause some drama, leave with a good story. But you ruined that plan entirely.",
      choices: [
        {
          text: '"Good. Your old plan sounded terrible anyway."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm to tease Kiki at this level.',
          next: 'tease_kiki',
          effects: { relationship: 12 },
        },
        {
          text: '"You held my attention too, Kiki."',
          next: 'mutual',
          effects: { relationship: 8 },
        },
      ],
    },
    tease_kiki: {
      id: 'tease_kiki',
      speaker: 'Kiki',
      text: "*actually laughs -- a real one, not the practiced mysterious chuckle* Okay. I deserved that. And you're right. The old plan was lonely disguised as independence.",
      next: 'real_moment',
    },
    mutual: {
      id: 'mutual',
      speaker: 'Kiki',
      text: "Don't say things like that when the moonlight is hitting your face at that angle. It's extremely unfair and I refuse to be held responsible for any resulting emotions.",
      next: 'real_moment',
    },
    real_moment: {
      id: 'real_moment',
      speaker: 'Kiki',
      text: "I pulled a card for myself this morning. First time in months. Want to know what it was?",
      next: 'the_card',
    },
    the_card: {
      id: 'the_card',
      speaker: 'Kiki',
      text: "The Anchor. It means finding a place to stay. Putting down roots instead of drifting. When I flipped it, I thought of you. And that scared me more than any card ever has.",
      choices: [
        {
          text: '"Scared can be good. It means it matters."',
          condition: (v) => v.charm >= 70,
          lockMessage: 'Needs 70 charm for this pivotal moment.',
          next: 'matters',
          effects: { relationship: 15 },
        },
        {
          text: '"You don\'t have to figure it all out tonight."',
          next: 'patient',
          effects: { relationship: 8 },
        },
      ],
    },
    matters: {
      id: 'matters',
      speaker: 'Kiki',
      text: "*voice barely a whisper* Yeah. It does matter. You matter. I can't believe I'm saying this out loud. The old Kiki would be absolutely horrified.",
      next: 'end_high',
    },
    patient: {
      id: 'patient',
      speaker: 'Kiki',
      text: "See? That. Right there. You don't push. You don't pull. You just... are. How do you do that?",
      next: 'end_high',
    },
    end_high: {
      id: 'end_high',
      speaker: 'Kiki',
      text: "Stay a while longer? The waves are doing their predictable thing again. But somehow, sitting here with you, they feel different. ...Don't you dare tell Sprocket I said anything sappy.",
    },
  },
};

// ---------------------------------------------------------------------------
// SPROCKET -- The joke-cracking penguin, friendship path
// ---------------------------------------------------------------------------

const sprocket_chat_low: DialogueScript = {
  id: 'sprocket_chat_low',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Sprocket',
      text: "Ay-oh! What do you call a penguin on a dating show? An ice-breaker! Ha! Get it? Because I'm a penguin? And I'm breaking the ice? This is my WHOLE thing.",
      choices: [
        {
          text: '"That was terrible and I need five more immediately."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm to match his energy.',
          next: 'more_jokes',
          effects: { relationship: 8 },
        },
        {
          text: '*polite laugh*',
          next: 'polite_laugh',
          effects: { relationship: 3 },
        },
        {
          text: '"...Do you have any other material?"',
          next: 'other_material',
          effects: { relationship: 1 },
        },
      ],
    },
    more_jokes: {
      id: 'more_jokes',
      speaker: 'Sprocket',
      text: "FINALLY! Someone with taste! Okay, okay -- what's a penguin's favorite relative? Aunt Arctica! Why did the penguin cross the road? To go with the floe! I have HUNDREDS.",
      next: 'behind_jokes',
    },
    polite_laugh: {
      id: 'polite_laugh',
      speaker: 'Sprocket',
      text: "A polite laugh! The second-worst kind of laugh, right after 'concerned silence.' But hey, I'll take it. The warm-up act is always rough.",
      next: 'behind_jokes',
    },
    other_material: {
      id: 'other_material',
      speaker: 'Sprocket',
      text: "Other material? OTHER material?! That's like asking a fish if it has other water. Jokes ARE the material, my friend. But fine. Let me try... being serious. *visibly struggles*",
      next: 'behind_jokes',
    },
    behind_jokes: {
      id: 'behind_jokes',
      speaker: 'Sprocket',
      text: "Real talk for exactly three seconds: I crack jokes because silences freak me out. If nobody's laughing, something's wrong. That's my philosophy. Time's up, back to jokes.",
      choices: [
        {
          text: '"Three seconds isn\'t enough. What are you actually afraid of?"',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm to get past the jokes.',
          next: 'real_fear',
          effects: { relationship: 8 },
        },
        {
          text: '"I get that. Laughter is a good defense."',
          next: 'defense',
          effects: { relationship: 5 },
        },
      ],
    },
    real_fear: {
      id: 'real_fear',
      speaker: 'Sprocket',
      text: "*beak opens, then closes* ...Whoa. You don't mess around, do you? I -- uh -- nobody's actually asked me that before. Can I get back to you on that? With a joke? Please?",
      next: 'end_low',
    },
    defense: {
      id: 'defense',
      speaker: 'Sprocket',
      text: "Defense? What? No! It's not a defense mechanism. It's a... social strategy. Completely different. *tugs at bowtie nervously*",
      next: 'end_low',
    },
    end_low: {
      id: 'end_low',
      speaker: 'Sprocket',
      text: "Okay, you're alright. Come back anytime -- I've got a new set I'm working on. It's all penguin puns. What? Don't look at me like that. Penguin puns are UNDERRATED.",
    },
  },
};

const sprocket_chat_mid: DialogueScript = {
  id: 'sprocket_chat_mid',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Sprocket',
      text: "Oh good, my favorite audience member! Sit, sit. I've been workshopping new material. Okay: why did Blaze bring a ladder to the ceremony? Because he wanted to reach new heights in manipulation!",
      next: 'greet2',
    },
    greet2: {
      id: 'greet2',
      speaker: 'Sprocket',
      text: "...Too mean? It's too mean. Pudge said I should be nicer. He also gave me a cookie while saying it, so I agreed to literally anything.",
      choices: [
        {
          text: '"Your best jokes come from a real place. Lean into that."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm to give comedy advice.',
          next: 'comedy_advice',
          effects: { relationship: 8 },
        },
        {
          text: '"Maybe roast yourself instead. Self-deprecation is gold."',
          next: 'self_roast',
          effects: { relationship: 5 },
        },
        {
          text: '"Just keep doing your thing, Sprocket."',
          next: 'keep_going',
          effects: { relationship: 4 },
        },
      ],
    },
    comedy_advice: {
      id: 'comedy_advice',
      speaker: 'Sprocket',
      text: "*pauses* Huh. You know what, you're right. The best comedy is just truth with a punchline. Like: I'm a penguin who can't swim. That's not a joke, that's just my life, and it's HILARIOUS.",
      next: 'deeper_talk',
    },
    self_roast: {
      id: 'self_roast',
      speaker: 'Sprocket',
      text: "Self-deprecation! My bread and butter! Okay: what do you call a penguin who thinks he's funny? Just a penguin. The funny is debatable. *chef's kiss*",
      next: 'deeper_talk',
    },
    keep_going: {
      id: 'keep_going',
      speaker: 'Sprocket',
      text: "My thing! Yes! The thing! Which is... jokes. And also occasionally having feelings by accident.",
      next: 'deeper_talk',
    },
    deeper_talk: {
      id: 'deeper_talk',
      speaker: 'Sprocket',
      text: "Can I tell you something without a punchline? I used to be the loudest penguin in the colony. Class clown, party starter, the whole deal. But at the end of the day, everyone went home and I was just... loud. In an empty room.",
      choices: [
        {
          text: '"You\'re not in an empty room anymore."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm for the emotional support.',
          next: 'not_empty',
          effects: { relationship: 10 },
        },
        {
          text: '"Being loud isn\'t the same as being heard."',
          next: 'being_heard',
          effects: { relationship: 7 },
        },
      ],
    },
    not_empty: {
      id: 'not_empty',
      speaker: 'Sprocket',
      text: "*long pause* ...Okay, wow, that hit different. Are you secretly a therapist? Because I did NOT consent to this emotional ambush. *voice cracks* I'm fine. This is fine.",
      next: 'end_mid',
    },
    being_heard: {
      id: 'being_heard',
      speaker: 'Sprocket',
      text: "Whoa. Deep. Like, ocean-floor deep. You just out-philosophied Lily and she literally talks to ferns. I... yeah. You're right. Ugh.",
      next: 'end_mid',
    },
    end_mid: {
      id: 'end_mid',
      speaker: 'Sprocket',
      text: "Okay, feelings quota is MAXED for the day. Tomorrow we go back to penguin puns. Deal? But also... thanks. For seeing the penguin behind the punchlines.",
    },
  },
};

const sprocket_chat_high: DialogueScript = {
  id: 'sprocket_chat_high',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Sprocket',
      text: "*sitting quietly for once* Hey. No jokes today. I know, I know -- mark the calendar. Sprocket has feelings that aren't wrapped in a punchline. Alert the media.",
      next: 'serious_sprocket',
    },
    serious_sprocket: {
      id: 'serious_sprocket',
      speaker: 'Sprocket',
      text: "I've been thinking about what happens after the show. Everyone goes home. The audience forgets. And I'm back to being the funny penguin at parties who nobody checks on afterward.",
      choices: [
        {
          text: '"I\'m not everyone. And I\'m not going to forget."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm for this level of sincerity.',
          next: 'promise',
          effects: { relationship: 12 },
        },
        {
          text: '"Real friends don\'t disappear when the cameras stop."',
          next: 'real_friends',
          effects: { relationship: 8 },
        },
      ],
    },
    promise: {
      id: 'promise',
      speaker: 'Sprocket',
      text: "*stares* You mean that. You actually mean that. I can tell because I'm usually the one reading the room and I can't find a single trace of sarcasm. That's... new.",
      next: 'confession',
    },
    real_friends: {
      id: 'real_friends',
      speaker: 'Sprocket',
      text: "Real friends. Is that what we are? Because I've had audiences and I've had acquaintances, but I'm not sure I've ever had a real friend. Not one who saw the unfunny parts.",
      next: 'confession',
    },
    confession: {
      id: 'confession',
      speaker: 'Sprocket',
      text: "I'm terrified of silence because silence is where the truth lives. And the truth is that I've been performing my entire life because I thought the real me wasn't enough.",
      choices: [
        {
          text: '"The real you just told me that, and it was more than enough."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm for the pivotal friendship moment.',
          next: 'enough',
          effects: { relationship: 15 },
        },
        {
          text: '"You don\'t have to earn people\'s time with jokes."',
          next: 'earn',
          effects: { relationship: 10 },
        },
      ],
    },
    enough: {
      id: 'enough',
      speaker: 'Sprocket',
      text: "*wipes eye with flipper* Okay, that's it. You're my best friend. Official. Legally binding. I'm going to make us friendship bracelets. Pudge has craft supplies.",
      next: 'end_high',
    },
    earn: {
      id: 'earn',
      speaker: 'Sprocket',
      text: "I don't? Because it really feels like I do. But... you're sitting here. In the silence. With me. And you haven't left. So maybe you're right.",
      next: 'end_high',
    },
    end_high: {
      id: 'end_high',
      speaker: 'Sprocket',
      text: "Okay I have ONE joke. Just one. What do you call a penguin who found his best friend? ...Happy. That's it. That's the whole joke. It's not even funny. But it's true.",
    },
  },
};

// ---------------------------------------------------------------------------
// LILY -- The nature-loving frog, introspective friend
// ---------------------------------------------------------------------------

const lily_chat_low: DialogueScript = {
  id: 'lily_chat_low',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Lily',
      text: "*kneeling by a fern* Oh! Sorry, I was just checking on this little one. Its leaves were drooping yesterday and I've been worried.",
      next: 'greet2',
    },
    greet2: {
      id: 'greet2',
      speaker: 'Lily',
      text: "I know it's silly to worry about a plant. Sprocket says I need to 'touch grass' and then laughs because I'm literally always touching grass.",
      choices: [
        {
          text: '"It\'s not silly. Caring about small things says a lot about a person."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm to connect with Lily on this.',
          next: 'meaningful',
          effects: { relationship: 8 },
        },
        {
          text: '"Is the fern going to make it?"',
          next: 'fern_update',
          effects: { relationship: 5 },
        },
        {
          text: '"Sprocket has a point, though."',
          next: 'point',
          effects: { relationship: -2 },
        },
      ],
    },
    meaningful: {
      id: 'meaningful',
      speaker: 'Lily',
      text: "*brightens* You think so? Most people think it's weird that I talk to plants. But they're better listeners than most animals I've met.",
      next: 'jungle_talk',
    },
    fern_update: {
      id: 'fern_update',
      speaker: 'Lily',
      text: "I think so! I moved it to a spot with more shade and gave it some extra water. Plants are resilient if you give them what they need. People are like that too, actually.",
      next: 'jungle_talk',
    },
    point: {
      id: 'point',
      speaker: 'Lily',
      text: "...Oh. *looks down* I suppose. I know I'm a lot. My whole 'talking to nature' thing isn't for everyone.",
      next: 'jungle_talk',
    },
    jungle_talk: {
      id: 'jungle_talk',
      speaker: 'Lily',
      text: "Have you explored the jungle yet? There's a spot deep in where the canopy opens up and the light filters through like liquid gold. I go there when the villa gets too loud.",
      choices: [
        {
          text: '"Show me sometime?"',
          next: 'show_me',
          effects: { relationship: 6 },
        },
        {
          text: '"Is the loudness hard for you?"',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm to ask about her comfort.',
          next: 'loudness',
          effects: { relationship: 7 },
        },
      ],
    },
    show_me: {
      id: 'show_me',
      speaker: 'Lily',
      text: "Really? Most people aren't interested in jungle walks. Blaze said nature is 'inefficient' and I genuinely didn't know how to respond to that.",
      next: 'end_low',
    },
    loudness: {
      id: 'loudness',
      speaker: 'Lily',
      text: "A little. I grew up on a quiet pond. The loudest thing was the evening chorus of cicadas, and that's a gentle kind of loud. This island is... a lot of personalities in a small space.",
      next: 'end_low',
    },
    end_low: {
      id: 'end_low',
      speaker: 'Lily',
      text: "This was really nice. Quiet conversations are my favorite kind. Come find me in the jungle anytime -- I'll be the frog talking to a tree. You can't miss me.",
    },
  },
};

const lily_chat_mid: DialogueScript = {
  id: 'lily_chat_mid',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Lily',
      text: "*sitting by the pond, journal open* I was just writing about today. I do this every evening -- documenting every new flower I find. Today I spotted an orchid I've never seen before.",
      next: 'journal',
    },
    journal: {
      id: 'journal',
      speaker: 'Lily',
      text: "I've filled three journals since arriving. Flowers, weather patterns, the way the light changes. Rosie says I should include gossip but I don't really understand gossip. Plants don't gossip.",
      choices: [
        {
          text: '"Plants just silently judge each other\'s root systems."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm for the nature humor.',
          next: 'nature_joke',
          effects: { relationship: 8 },
        },
        {
          text: '"Can I see the orchid drawing?"',
          next: 'orchid',
          effects: { relationship: 6 },
        },
        {
          text: '"Three journals? That\'s dedication."',
          next: 'dedication',
          effects: { relationship: 4 },
        },
      ],
    },
    nature_joke: {
      id: 'nature_joke',
      speaker: 'Lily',
      text: "*laughs -- the first loud sound she's made* Oh! I -- that's actually really funny. I didn't know you could joke about plants. Sprocket never jokes about plants. He's missing out.",
      next: 'fortune_teller',
    },
    orchid: {
      id: 'orchid',
      speaker: 'Lily',
      text: "*carefully turns the journal* It's right here. I pressed a petal next to the sketch so I could remember the exact color. Isn't it beautiful? The veins look like tiny rivers.",
      next: 'fortune_teller',
    },
    dedication: {
      id: 'dedication',
      speaker: 'Lily',
      text: "Is it? I guess I never thought of it as dedication. It's more like breathing. If I don't write it down, it's like it never happened.",
      next: 'fortune_teller',
    },
    fortune_teller: {
      id: 'fortune_teller',
      speaker: 'Lily',
      text: "Can I tell you why I'm really here? A fortune teller told me my next chapter begins on an island far from home. I know it sounds foolish, but... everything in the forest pointed me here.",
      choices: [
        {
          text: '"Not foolish. The best journeys start with a leap of faith."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm for the philosophical response.',
          next: 'faith',
          effects: { relationship: 10 },
        },
        {
          text: '"Has the island lived up to the fortune?"',
          next: 'lived_up',
          effects: { relationship: 6 },
        },
      ],
    },
    faith: {
      id: 'faith',
      speaker: 'Lily',
      text: "*looks up with wide eyes* A leap of faith. Like a frog. I just realized that's literally what I do. I leap. Maybe the fortune teller was being literal.",
      next: 'end_mid',
    },
    lived_up: {
      id: 'lived_up',
      speaker: 'Lily',
      text: "Parts of it have. The jungle is magnificent. The sunsets hurt my heart in the best way. And... some of the people have surprised me. Present company included.",
      next: 'end_mid',
    },
    end_mid: {
      id: 'end_mid',
      speaker: 'Lily',
      text: "The fireflies are starting to come out. That means it's late and I should sleep. But first -- *hands you a pressed flower* -- I want you to have this. For your own journal. Even if you don't have one yet.",
    },
  },
};

const lily_chat_high: DialogueScript = {
  id: 'lily_chat_high',
  startNode: 'greet',
  nodes: {
    greet: {
      id: 'greet',
      speaker: 'Lily',
      text: "*sitting in the canopy clearing* You found it. The secret spot I told you about. I was hoping you'd come.",
      next: 'clearing',
    },
    clearing: {
      id: 'clearing',
      speaker: 'Lily',
      text: "Look up. See how the light comes through? I've been sketching this every day for a week and I can never get it right. Some things are too alive for paper.",
      choices: [
        {
          text: '"Maybe some things are meant to be experienced, not captured."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm for the philosophical connection.',
          next: 'experienced',
          effects: { relationship: 12 },
        },
        {
          text: '"It\'s stunning. Thank you for sharing it with me."',
          next: 'sharing',
          effects: { relationship: 8 },
        },
      ],
    },
    experienced: {
      id: 'experienced',
      speaker: 'Lily',
      text: "*softly* Yes. That's exactly it. That's what I've been trying to write in my journal and couldn't find the words for. You just said it like it was nothing.",
      next: 'roots',
    },
    sharing: {
      id: 'sharing',
      speaker: 'Lily',
      text: "I've never brought anyone here before. Not even Rosie, and she's the closest thing I have to a best friend. But this felt like... your kind of place.",
      next: 'roots',
    },
    roots: {
      id: 'roots',
      speaker: 'Lily',
      text: "I've spent my whole life studying roots -- how plants anchor themselves, how they find their place. But I never managed to do that myself. I just kept drifting from pond to pond.",
      choices: [
        {
          text: '"Maybe you don\'t need one place. Maybe you need one person who feels like home."',
          condition: (v) => v.charm >= 70,
          lockMessage: 'Needs 70 charm for this heartfelt declaration.',
          next: 'home',
          effects: { relationship: 15 },
        },
        {
          text: '"Drifting isn\'t always bad. Some plants thrive on the current."',
          next: 'drifting',
          effects: { relationship: 8 },
        },
      ],
    },
    home: {
      id: 'home',
      speaker: 'Lily',
      text: "*voice catches* ...Oh. I wasn't ready for that. I'm going to need a moment. And possibly a larger journal because this feeling doesn't fit in the current one.",
      next: 'end_high',
    },
    drifting: {
      id: 'drifting',
      speaker: 'Lily',
      text: "Like water lilies. They float, but they still bloom wherever they land. Maybe that's enough. Maybe I'm enough, just as I am.",
      next: 'end_high',
    },
    end_high: {
      id: 'end_high',
      speaker: 'Lily',
      text: "The cicadas are singing. In my forest, that means everything is as it should be. And right now... I think it is. Let's just sit here a while. The jungle has all the conversation we need.",
    },
  },
};

// ---------------------------------------------------------------------------
// DATE DIALOGUES -- Romantic interest date scenes
// ---------------------------------------------------------------------------

const rosie_date: DialogueScript = {
  id: 'rosie_date',
  startNode: 'opening',
  nodes: {
    opening: {
      id: 'opening',
      speaker: 'Rosie',
      text: "*nervously adjusting a flower behind her ear* So! A date! A real, actual date! I've written about these in my letters but never actually... been on one. This is fine. Everything is fine.",
      next: 'opening2',
    },
    opening2: {
      id: 'opening2',
      speaker: 'Rosie',
      text: "I packed us a picnic. There's carrot cake, obviously. And some wildflowers for the blanket because I read somewhere that ambiance matters. Do I sound like I rehearsed this? Because I absolutely did.",
      choices: [
        {
          text: '"You\'re adorable when you\'re nervous."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm to be confidently endearing.',
          next: 'adorable',
          effects: { relationship: 12 },
        },
        {
          text: '"I rehearsed too, so we\'re even."',
          next: 'even',
          effects: { relationship: 8 },
        },
        {
          text: '"Let\'s eat. I\'m starving."',
          next: 'hungry',
          effects: { relationship: 3 },
        },
      ],
    },
    adorable: {
      id: 'adorable',
      speaker: 'Rosie',
      text: "*ears go flat, face bright red* Did you just -- I -- OKAY. Okay. I'm going to pretend you didn't just short-circuit my entire brain. Let's eat cake. Cake is safe.",
      next: 'picnic_scene',
    },
    even: {
      id: 'even',
      speaker: 'Rosie',
      text: "*laughs* Really? What was your rehearsal like? Mine involved a mirror, three outfit changes, and Sprocket heckling me from the doorway.",
      next: 'picnic_scene',
    },
    hungry: {
      id: 'hungry',
      speaker: 'Rosie',
      text: "Right to the food! I respect that. A creature of appetite. The cake is the star anyway -- I'm just the nervous bunny holding it.",
      next: 'picnic_scene',
    },
    picnic_scene: {
      id: 'picnic_scene',
      speaker: 'Rosie',
      text: "*sets up the blanket under a tree* There. Perfect. The sunset should hit right... there... in about twenty minutes. I may have timed this precisely. Don't judge me.",
      next: 'deep_question',
    },
    deep_question: {
      id: 'deep_question',
      speaker: 'Rosie',
      text: "Can I ask you something serious? Between the puns and the carrot cake? ...What made you pick me? For the date, I mean. There are plenty of people here who are more... impressive.",
      choices: [
        {
          text: '"Because impressive is boring. Genuine is rare."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm for the perfect answer.',
          next: 'perfect_answer',
          effects: { relationship: 15 },
        },
        {
          text: '"Because you make me laugh, and that matters more than impressive."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm for the heartfelt answer.',
          next: 'laugh_answer',
          effects: { relationship: 10 },
        },
        {
          text: '"I like spending time with you. Simple as that."',
          next: 'simple_answer',
          effects: { relationship: 6 },
        },
      ],
    },
    perfect_answer: {
      id: 'perfect_answer',
      speaker: 'Rosie',
      text: "*puts down the cake slice* ...That's going in a letter. That's going in THE letter. The one I actually send. I -- wow. Okay. I think the sunset can stop being romantic now because you just won.",
      next: 'sunset_moment',
    },
    laugh_answer: {
      id: 'laugh_answer',
      speaker: 'Rosie',
      text: "*softly* You know, all those years writing unsent letters, I always described my perfect match as someone who'd laugh at my worst pun and mean it. I think the universe was listening.",
      next: 'sunset_moment',
    },
    simple_answer: {
      id: 'simple_answer',
      speaker: 'Rosie',
      text: "Simple. Yeah. I like that. No grand declarations, no performance. Just... this. A blanket, some cake, and two people who enjoy each other's company.",
      next: 'sunset_moment',
    },
    sunset_moment: {
      id: 'sunset_moment',
      speaker: 'Rosie',
      text: "*the sunset hits exactly as planned* Look at that. Right on time. Even the sky is cooperating with my extremely detailed date plan.",
      next: 'closing',
    },
    closing: {
      id: 'closing',
      speaker: 'Rosie',
      text: "Hey. Thank you. For the date, for the conversation, for not running away when I said I had three outfit changes. I hope there's a next time. And more cake. Always more cake.",
    },
  },
};

const kiki_date: DialogueScript = {
  id: 'kiki_date',
  startNode: 'opening',
  nodes: {
    opening: {
      id: 'opening',
      speaker: 'Kiki',
      text: "*waiting by the moonlit tide pools* You came. Part of me thought you wouldn't. The smart part of me knew you would. I tend to listen to the smart part.",
      choices: [
        {
          text: '"Wild horses couldn\'t keep me away. Well, maybe wild horses. They\'re fast."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm for the confident humor.',
          next: 'charm_opener',
          effects: { relationship: 10 },
        },
        {
          text: '"This is beautiful. Do you always pick the best spots?"',
          next: 'nice_spot',
          effects: { relationship: 6 },
        },
      ],
    },
    charm_opener: {
      id: 'charm_opener',
      speaker: 'Kiki',
      text: "*smirks* A joke. On a moonlit beach. With me. You're either very brave or very foolish. I haven't decided which I prefer.",
      next: 'tide_pools',
    },
    nice_spot: {
      id: 'nice_spot',
      speaker: 'Kiki',
      text: "I have a talent for finding beautiful things in dark places. The tide pools glow at night -- bioluminescence. Nature's own party trick.",
      next: 'tide_pools',
    },
    tide_pools: {
      id: 'tide_pools',
      speaker: 'Kiki',
      text: "*crouches by a glowing pool* Look at that. Tiny creatures producing their own light. They don't need the sun. They don't need anyone. ...I used to admire that. Now I'm not so sure.",
      choices: [
        {
          text: '"Making your own light is impressive. Sharing it is better."',
          condition: (v) => v.charm >= 65,
          lockMessage: 'Needs 65 charm for the poetic response.',
          next: 'poetic',
          effects: { relationship: 12 },
        },
        {
          text: '"What changed?"',
          next: 'what_changed',
          effects: { relationship: 7 },
        },
      ],
    },
    poetic: {
      id: 'poetic',
      speaker: 'Kiki',
      text: "*looks up slowly* ...You keep doing that. Saying exactly the thing that gets past my defenses. It's like you have a skeleton key to every wall I've built.",
      next: 'vulnerable_moment',
    },
    what_changed: {
      id: 'what_changed',
      speaker: 'Kiki',
      text: "*traces the water with a claw* Meeting someone who made the darkness feel less like a hiding place and more like a waste. That's what changed.",
      next: 'vulnerable_moment',
    },
    vulnerable_moment: {
      id: 'vulnerable_moment',
      speaker: 'Kiki',
      text: "I left my old life because I got tired of reading everyone else's future while ignoring my own. Every card I flipped for a stranger was a question I wouldn't ask myself.",
      choices: [
        {
          text: '"So flip a card now. For us. For whatever this is."',
          condition: (v) => v.charm >= 70,
          lockMessage: 'Needs 70 charm for this romantic gesture.',
          next: 'flip_card',
          effects: { relationship: 15 },
        },
        {
          text: '"You don\'t need cards to know what you want."',
          next: 'no_cards',
          effects: { relationship: 8 },
        },
      ],
    },
    flip_card: {
      id: 'flip_card',
      speaker: 'Kiki',
      text: "*pulls a card from behind her ear -- she always has one* ...The Lighthouse. It means a guiding presence. Someone who shows you the way home without telling you which path to take. *voice barely audible* I think that's you.",
      next: 'closing',
    },
    no_cards: {
      id: 'no_cards',
      speaker: 'Kiki',
      text: "No. I suppose I don't. For once, what I want is sitting right in front of me and I don't need to interpret it through symbolism. That's terrifying and wonderful in equal measure.",
      next: 'closing',
    },
    closing: {
      id: 'closing',
      speaker: 'Kiki',
      text: "*stands, offers a paw* Walk with me along the shore? The tide pools will be here tomorrow. But this night... this one is just ours.",
    },
  },
};

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

export const NPC_DIALOGUES: Record<string, DialogueScript[]> = {
  rosie: [rosie_chat_low, rosie_chat_mid, rosie_chat_high],
  blaze: [blaze_chat_low, blaze_chat_mid, blaze_chat_high],
  pudge: [pudge_chat_low, pudge_chat_mid, pudge_chat_high],
  kiki: [kiki_chat_low, kiki_chat_mid, kiki_chat_high],
  sprocket: [sprocket_chat_low, sprocket_chat_mid, sprocket_chat_high],
  lily: [lily_chat_low, lily_chat_mid, lily_chat_high],
};

export const DATE_DIALOGUES: Record<string, DialogueScript> = {
  rosie: rosie_date,
  kiki: kiki_date,
};

/**
 * Pick the appropriate chat dialogue script for an NPC based on
 * the player's current relationship level with them.
 *
 * Tier boundaries align with the relationship system:
 *   low  = relationship < 20   (hostile / cold / neutral)
 *   mid  = 20 <= relationship < 60  (warm / close-ish)
 *   high = relationship >= 60  (close / romantic)
 */
export function getDialogueForNPC(npcId: string, relationship: number): DialogueScript {
  const scripts = NPC_DIALOGUES[npcId];
  if (!scripts || scripts.length === 0) {
    throw new Error(`No dialogue scripts found for NPC: ${npcId}`);
  }

  if (relationship >= 60) return scripts[2] ?? scripts[scripts.length - 1];
  if (relationship >= 20) return scripts[1] ?? scripts[0];
  return scripts[0];
}

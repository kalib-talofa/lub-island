import type { DialogueScript } from '@/utils/ink';

// ---------------------------------------------------------------------------
// PUDGE — Day 1: Shy introduction, offers snacks nervously
// ---------------------------------------------------------------------------

const pudge_d1_low: DialogueScript = {
  id: 'pudge_d1_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: 'Oh! Um... hi. I was just... making a snack. Do you want some?',
      next: 'offer',
    },
    offer: {
      id: 'offer',
      speaker: 'Pudge',
      text: "It's, uh... honey toast with cinnamon. My grandmother's recipe. I always make it when I'm... nervous.",
      choices: [
        {
          text: '"That sounds amazing, I\'d love to try some."',
          condition: (v) => v.charm >= 30,
          lockMessage: 'Needs 30 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Sure, thanks!"',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Maybe later."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: '*blushes* R-really? Most people just grab chips from the kitchen. You... actually want to try it?',
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Here you go! Um, careful, it's still warm. That's... that's the best part though.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Oh, okay! That's... that's fine. I'll just, um... save some. In case you change your mind.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "It was nice... talking. Even just a little. Um, see you around?",
    },
  },
};

const pudge_d1_mid: DialogueScript = {
  id: 'pudge_d1_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "Oh, hey! I, um... I was hoping I'd run into you. I made extra honey toast this time.",
      next: 'settle',
    },
    settle: {
      id: 'settle',
      speaker: 'Pudge',
      text: "Everything here is so... loud, you know? All these people everywhere. I keep looking for a quiet corner. Is that weird?",
      choices: [
        {
          text: '"Not at all. Quiet corners are underrated."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"I get it. It can be overwhelming."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"You should try to get out there more."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "Right? I found this little spot by the kitchen garden. The basil there smells just like... like home. Maybe I could show you sometime?",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Yeah... it really can. But this toast helps. Food always helps. That's what my grandma used to say.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "I... yeah. You're probably right. I just... I'm not very good at the big group stuff. But I'm trying.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Thanks for sitting with me. It's, um... it's nice not eating alone for once.",
    },
  },
};

const pudge_d1_high: DialogueScript = {
  id: 'pudge_d1_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "There you are! I've been... um, not waiting for you or anything. I just made way too much food again.",
      next: 'open_up',
    },
    open_up: {
      id: 'open_up',
      speaker: 'Pudge',
      text: "Can I be honest? When I got here, I almost turned around and went home. But then... I met you. And the noise got a little quieter.",
      choices: [
        {
          text: '"I\'m really glad you stayed, Pudge."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"This place is better with you in it."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Yeah, first days are always rough."',
          next: 'cold',
          effects: { relationship_level: 6 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*ears go pink* You... you mean that? Nobody's ever said anything like that to me before. I, um... I'm glad I stayed too.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "That's... wow. Um. I don't really know what to do with a compliment that nice. Thank you.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Yeah, they really are. But tomorrow I'll make cinnamon rolls. That always makes a new place feel more like home.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I, um... I made you something. I hope it's okay. It's just a little honey cake. For being kind to me today.",
    },
  },
};

// ---------------------------------------------------------------------------
// PUDGE — Day 2: Shares a recipe or cooking dream
// ---------------------------------------------------------------------------

const pudge_d2_low: DialogueScript = {
  id: 'pudge_d2_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "Oh! I didn't see you there. I was, um... writing something down. A recipe. It's nothing.",
      next: 'explain',
    },
    explain: {
      id: 'explain',
      speaker: 'Pudge',
      text: "I keep this little notebook of recipes. My grandmother started it and I... I've been adding to it. Someday I want to open a bakery. ...That sounds silly, right?",
      choices: [
        {
          text: '"A bakery? Tell me more about that dream."',
          condition: (v) => v.charm >= 30,
          lockMessage: 'Needs 30 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"That\'s a cool dream."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Sounds like a lot of work."',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "You... want to hear about it? Um, well... I'd call it something simple. Maybe 'Grandma Bear's.' And everything would be made from scratch. With real honey.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "You think so? I, um... thanks. I don't tell many people about it. It feels kind of personal, you know?",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Y-yeah... it would be. But the good kind of work? Like... the kind where you don't mind being tired because you made something that matters.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Um... anyway. I should get back to this. But... thanks for listening. Not everyone does.",
    },
  },
};

const pudge_d2_mid: DialogueScript = {
  id: 'pudge_d2_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "Hey! I was actually hoping to find you. I tried something new this morning -- lavender shortbread. Want to be my taste tester?",
      next: 'recipe',
    },
    recipe: {
      id: 'recipe',
      speaker: 'Pudge',
      text: "My grandmother always said the secret to good baking is patience. You can't rush dough. You just... let it become what it's going to become.",
      choices: [
        {
          text: '"Your grandmother sounds like a wise bear."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 7 },
        },
        {
          text: '"This shortbread is incredible."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Do you always talk about your grandma this much?"',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "She really was. She used to say people are like bread -- they rise when you give them warmth. I... I think about that a lot.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "*beams* Really? I tried a new ratio of butter to flour. I've been tweaking it for months. You just made my whole day.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Oh... sorry. I guess I do. She's just... she's the reason I am who I am. But I can talk about other things.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I wrote down the recipe if you ever want it. No pressure. I just... like sharing food with people who appreciate it.",
    },
  },
};

const pudge_d2_high: DialogueScript = {
  id: 'pudge_d2_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I saved the best batch for you. Don't tell anyone, but I actually got up at five to make these. ...Is that weird? That's probably weird.",
      next: 'dream',
    },
    dream: {
      id: 'dream',
      speaker: 'Pudge',
      text: "I've been thinking... if I ever open that bakery, I'd want it to feel like sitting at my grandmother's kitchen table. A place where nobody has to pretend to be anything they're not.",
      choices: [
        {
          text: '"I\'d be your first regular customer."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 10 },
        },
        {
          text: '"That sounds like a really special place."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Sounds cozy."',
          next: 'cold',
          effects: { relationship_level: 6 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*voice cracks a little* You'd... really come? I've never had someone say that before. I think you'd have a permanent reserved seat.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Special. Yeah. I want people to walk in feeling heavy and walk out feeling... lighter. Like how my grandma made me feel.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Cozy is good. Cozy is exactly what I'm going for. The world has enough fancy places. I just want somewhere warm.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "You know, talking about it with you... it feels less like a daydream and more like a plan. That's new for me.",
    },
  },
};

// ---------------------------------------------------------------------------
// PUDGE — Day 3: Surprisingly insightful observation about group dynamics
// ---------------------------------------------------------------------------

const pudge_d3_low: DialogueScript = {
  id: 'pudge_d3_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "Oh... hi. I've been sitting here watching everyone. Not in a creepy way! Just... observing. Um.",
      next: 'observe',
    },
    observe: {
      id: 'observe',
      speaker: 'Pudge',
      text: "Have you noticed that... people act different depending on who's watching? Like, Blaze is only loud when he has an audience. When he thinks nobody's looking, he just stares at the ocean.",
      choices: [
        {
          text: '"That\'s a really perceptive observation, Pudge."',
          condition: (v) => v.charm >= 35,
          lockMessage: 'Needs 35 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Huh, I never noticed that."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"You spend a lot of time watching people?"',
          next: 'cold',
          effects: { relationship_level: 1 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "R-really? I just... when you're quiet, people forget you're there. And then they show you who they really are.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Most people don't. Everyone's so busy performing that they miss the quiet parts. The quiet parts are where the truth is.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "I... guess I do. When you can't keep up with the conversation, you end up watching it instead. You learn things.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Sorry, that got kind of deep. I, um... I'll go check on the oven. I think my scones are almost ready.",
    },
  },
};

const pudge_d3_mid: DialogueScript = {
  id: 'pudge_d3_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "Can I tell you something? I've been watching everyone, and... I think most of us are lonely. Even the ones who laugh the loudest.",
      next: 'insight',
    },
    insight: {
      id: 'insight',
      speaker: 'Pudge',
      text: "Sprocket keeps cracking jokes, but have you seen his face when nobody laughs? It's like watching a candle flicker out. And Kiki acts like she doesn't care, but she sketches people when they're not looking. That's not indifference. That's attention.",
      choices: [
        {
          text: '"You notice things most people miss entirely."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"You\'re right. Everyone has layers."',
          next: 'friendly',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Maybe you\'re overthinking it."',
          next: 'cold',
          effects: { relationship_level: 3 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "I think it's because nobody ever notices me. So I had to get good at noticing everyone else. ...Maybe that sounds sad, but it's actually kind of a superpower.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Like an onion. ...Sorry, food metaphor. But you know what I mean. Peel back the performance and there's something real underneath.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Maybe. But... I don't think caring too much about people is ever really overthinking. It's just... paying attention.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I'm glad I can talk to you about this stuff. Most people just want to talk about the drama. Not what's underneath it.",
    },
  },
};

const pudge_d3_high: DialogueScript = {
  id: 'pudge_d3_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I've been thinking about something, and... you're the only one I want to say it to.",
      next: 'deep',
    },
    deep: {
      id: 'deep',
      speaker: 'Pudge',
      text: "Everyone here is so worried about being chosen. But I think the real question isn't who picks you -- it's whether you'd still be yourself if nobody was watching. Most people here wouldn't be.",
      choices: [
        {
          text: '"Would you?"',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 11 },
        },
        {
          text: '"That\'s honestly profound, Pudge."',
          next: 'friendly',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Heavy thoughts for a sunny island."',
          next: 'cold',
          effects: { relationship_level: 6 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "...Yeah. I think I would. I'd still be making honey toast at five in the morning and watching the sunrise alone. But now I'd wonder if you were awake too.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "I don't know about profound. I just think... being real is the bravest thing you can do in a place like this. And you do it every day.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "*chuckles* You're right. Maybe I should save the philosophy for rainy days. But I meant it.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Thanks for letting me be the weird deep bear for a minute. I made you chamomile tea, by the way. It's on the counter.",
    },
  },
};

// ---------------------------------------------------------------------------
// PUDGE — Day 4: Comfort food and what "home" means
// ---------------------------------------------------------------------------

const pudge_d4_low: DialogueScript = {
  id: 'pudge_d4_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I, um... I've been making soup. When I miss home, I make soup. It's kind of my thing.",
      next: 'home',
    },
    home: {
      id: 'home',
      speaker: 'Pudge',
      text: "Home is... a wood stove and rain on the roof and the smell of pine. And my grandmother humming in the kitchen. Do you... do you have a place like that?",
      choices: [
        {
          text: '"Tell me more about your grandmother\'s kitchen."',
          condition: (v) => v.charm >= 40,
          lockMessage: 'Needs 40 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Yeah, I think everyone has a place like that."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"I don\'t really think about home much."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "It was small. The ceiling was low and the table wobbled. But it smelled like bread and honey every single morning. I'd give anything to go back there for just one afternoon.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Yeah... a place that just feels right. Where the walls know you. I think that's what I'm trying to build wherever I go. Piece by piece.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Oh... that's okay. Not everyone does. Maybe home isn't always a place. Maybe it's something you carry.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Um... the soup's almost ready if you want some. It's not my grandma's exactly, but... it's close enough to feel warm.",
    },
  },
};

const pudge_d4_mid: DialogueScript = {
  id: 'pudge_d4_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I cooked something special today. My grandmother's mountain stew. I only make it when I really need comfort.",
      next: 'meaning',
    },
    meaning: {
      id: 'meaning',
      speaker: 'Pudge',
      text: "I've been thinking about what 'home' really means. It used to mean the lodge. Then it meant my grandmother's kitchen. Now... I think it might mean something different. Like maybe home can be a person too.",
      choices: [
        {
          text: '"Are you saying I feel like home to you?"',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"I think home is wherever you feel safe."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"That\'s a nice thought."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*goes completely red* I-I... um... I wasn't... okay, maybe I was. A little. You make the noise stop. That's what home does.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Safe. Yeah. That's exactly the word. And you know what? Right here, right now, with this stew and this conversation... I feel safe.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Thanks. I... know I think too much about these things. But when you're far from everything familiar, you start to wonder what really matters.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Here. I put extra rosemary in yours. My grandma said rosemary means 'remember me.' ...Don't read too much into that. Or do. I don't mind.",
    },
  },
};

const pudge_d4_high: DialogueScript = {
  id: 'pudge_d4_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I spent all morning in the kitchen. Not because I was nervous this time. Because I was happy. That's... new.",
      next: 'heart',
    },
    heart: {
      id: 'heart',
      speaker: 'Pudge',
      text: "I used to think home was a place you could never leave. But now I wonder if maybe it's a place you keep choosing to come back to. Or... someone you keep choosing.",
      choices: [
        {
          text: '"I\'d choose you, Pudge. Every time."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You deserve someone who chooses you."',
          next: 'friendly',
          effects: { relationship_level: 9 },
        },
        {
          text: '"That\'s a really beautiful way to think about it."',
          next: 'cold',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*voice barely above a whisper* You... I... nobody's ever... *takes a shaky breath* Can I just sit here with you for a while? I don't need words right now. Just this.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "That's the nicest thing anyone has said to me since my grandmother. And she said it with pie, so you've got competition.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Beautiful and terrifying. Because choosing means you could lose. But... I think I'm ready to risk it.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I made you my grandmother's secret recipe. The one she said to only share with someone who matters. So... yeah. You matter.",
    },
  },
};

// ---------------------------------------------------------------------------
// PUDGE — Day 5: Why he values peace (contrast with loud island)
// ---------------------------------------------------------------------------

const pudge_d5_low: DialogueScript = {
  id: 'pudge_d5_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I found this spot behind the villa where you can hear the waves but not the shouting. It's... nice. Um. Do you want to sit?",
      next: 'peace',
    },
    peace: {
      id: 'peace',
      speaker: 'Pudge',
      text: "The mountain where I grew up was so quiet you could hear snow falling. Out here everything is so... much. I don't understand how everyone just handles it.",
      choices: [
        {
          text: '"What does the quiet give you that this doesn\'t?"',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Some of us just need more quiet than others."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"You\'ll get used to it eventually."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "Space to think. Space to feel things without performing them. Out here everyone turns their feelings into a show. I just want to... feel them honestly.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Yeah... I think you're right. And I shouldn't feel bad about that. It's just hard when everyone acts like being loud is the only way to exist.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Maybe. Or maybe I'll just keep finding quiet spots and making soup in them. That's kind of my strategy so far.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Thanks for... being quiet with me. That sounds strange, but it's actually the best compliment I can give someone.",
    },
  },
};

const pudge_d5_mid: DialogueScript = {
  id: 'pudge_d5_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "Can I be honest about something? This island scares me. Not the challenges or the drama. The noise. The constant, relentless noise.",
      next: 'why',
    },
    why: {
      id: 'why',
      speaker: 'Pudge',
      text: "Back home, silence is where I find myself. It's where my best ideas come, where I feel most real. Here, there's never any silence. And sometimes I feel like I'm disappearing.",
      choices: [
        {
          text: '"You\'re not disappearing. I see you."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Silence is a strength, not a weakness."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"It\'s only a few more days."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*long pause* ...You have no idea how much I needed to hear that. Sometimes I wonder if anyone would notice if I just quietly slipped away. But you... you always notice.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "A strength... I never thought of it that way. Everyone here treats confidence like volume. But maybe listening is its own kind of brave.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Yeah... a few more days. I can do that. I just... wanted someone to know. In case I get quiet. Quieter than usual, I mean.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I made mint tea. Two cups. Because I was hoping you'd come find me. ...And you did.",
    },
  },
};

const pudge_d5_high: DialogueScript = {
  id: 'pudge_d5_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I want to tell you something I've never told anyone. About why quiet matters so much to me.",
      next: 'reveal',
    },
    reveal: {
      id: 'reveal',
      speaker: 'Pudge',
      text: "When I was little, the lodge was always full of shouting. Not the good kind. My parents argued every night. The only peace I had was the kitchen, at dawn, with my grandmother. She never raised her voice. Not once. She taught me that gentleness is a choice you make when the world gives you every reason to be loud.",
      choices: [
        {
          text: '"Thank you for trusting me with that."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"Your grandmother raised an incredible bear."',
          next: 'friendly',
          effects: { relationship_level: 9 },
        },
        {
          text: '"I\'m sorry you went through that."',
          next: 'cold',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*eyes glistening* I trust you because you never made me feel small for being soft. That's so rare. You don't even know how rare that is.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "She did her best. And I think... I think she'd like you. She always said you can tell a lot about someone by how they treat the quiet ones.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Don't be sorry. It made me who I am. Every loaf of bread, every recipe, every quiet morning -- it all came from that. Gentleness born from chaos.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I don't need someone who makes the world louder. I need someone who makes the silence feel full. And you do that.",
    },
  },
};

// ---------------------------------------------------------------------------
// PUDGE — Day 6: Protective/caring side — worried about another islander
// ---------------------------------------------------------------------------

const pudge_d6_low: DialogueScript = {
  id: 'pudge_d6_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "Hey, um... can I talk to you about something? I'm worried about Sprocket. He's been laughing a lot but... it doesn't reach his eyes.",
      next: 'concern',
    },
    concern: {
      id: 'concern',
      speaker: 'Pudge',
      text: "I left some cookies outside his door this morning. Anonymous, you know? I didn't want to embarrass him. Do you think that's... enough?",
      choices: [
        {
          text: '"That\'s really kind, Pudge. Maybe just let him know you\'re there."',
          condition: (v) => v.charm >= 45,
          lockMessage: 'Needs 45 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"Cookies are a good start."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Maybe it\'s not your problem to fix."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "You're right. Being there matters more than being anonymous. I just... I know what it's like to hurt quietly. I don't want anyone else to feel invisible.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "I hope so. Food won't fix everything, but... at least he'll know somebody noticed. That's what matters, right?",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Maybe not. But... if everyone thought that, nobody would ever help anyone. And I'd rather care too much than not enough.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Sorry for dumping this on you. I just... you're the only one I feel like I can talk to about real stuff.",
    },
  },
};

const pudge_d6_mid: DialogueScript = {
  id: 'pudge_d6_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I did something today. I sat down next to Sprocket when nobody was around and just... didn't say anything. Just sat there.",
      next: 'story',
    },
    story: {
      id: 'story',
      speaker: 'Pudge',
      text: "After a while he stopped joking. Just went quiet. And then he said, 'Thanks for not making me be funny.' And I almost cried, honestly. Because I know exactly what that feels like.",
      choices: [
        {
          text: '"You gave him something nobody else could."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Sometimes being present is the greatest gift."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"Is he going to be okay?"',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "I gave him silence. Which sounds like nothing, but... sometimes nothing is everything. You taught me that, you know. By being quiet with me first.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Exactly. My grandmother used to say the best thing you can give someone is permission to stop performing. I finally understand what she meant.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "I think so. He ate three cookies and then told me a joke that was actually funny for once. Like, genuinely funny. Not a mask.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I used to think I wasn't tough enough for this island. But maybe being gentle is its own kind of strength. ...Thanks for seeing that in me.",
    },
  },
};

const pudge_d6_high: DialogueScript = {
  id: 'pudge_d6_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I need to tell you something. I overheard Blaze saying something cruel about Lily today. And I... I stood up.",
      next: 'brave',
    },
    brave: {
      id: 'brave',
      speaker: 'Pudge',
      text: "My voice was shaking the whole time. But I told him that tearing people down doesn't make you taller. And he actually went quiet. Me. I made Blaze go quiet. My heart is still pounding.",
      choices: [
        {
          text: '"I am so proud of you."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"That took real courage, Pudge."',
          next: 'friendly',
          effects: { relationship_level: 9 },
        },
        {
          text: '"Wow, I didn\'t expect that from you."',
          next: 'cold',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*tears up* Proud? You're... proud of me? I've been waiting my whole life for someone to say that. You have no idea what those words mean coming from you.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Courage... me? I was terrified. But I kept thinking about you. How you always do the right thing even when it's hard. I wanted to be like that.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Honestly? I didn't expect it from me either. But some things are more important than being comfortable. And Lily didn't deserve that.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I think... I think you make me braver. Just by believing I can be. That's the most powerful thing anyone's ever given me.",
    },
  },
};

// ---------------------------------------------------------------------------
// PUDGE — Day 7: Comfort before ceremony, gentle wisdom about what matters
// ---------------------------------------------------------------------------

const pudge_d7_low: DialogueScript = {
  id: 'pudge_d7_low',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "It's the last day. I, um... I made cinnamon rolls. For everyone. But I saved the best one for you.",
      next: 'reflect',
    },
    reflect: {
      id: 'reflect',
      speaker: 'Pudge',
      text: "Whatever happens tonight... I want you to know this week was the first time I felt like I belonged somewhere outside my grandmother's kitchen. That means something.",
      choices: [
        {
          text: '"You belong more places than you realize, Pudge."',
          condition: (v) => v.charm >= 50,
          lockMessage: 'Needs 50 charm',
          next: 'smooth',
          effects: { relationship_level: 5 },
        },
        {
          text: '"This week meant a lot to me too."',
          next: 'friendly',
          effects: { relationship_level: 3 },
        },
        {
          text: '"Good luck tonight."',
          next: 'cold',
          effects: { relationship_level: 2 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "Maybe you're right. I spent so long thinking I was too quiet for the world. But maybe the world just needed to get a little quieter to hear me.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "Really? Even with all my, um... awkwardness and rambling about recipes? That's... thank you.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "Thanks. I, um... I'll need it. But whatever happens, I'm glad I came. I'm glad I didn't run away on the first day.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Eat the cinnamon roll while it's warm. And... remember me, okay? Even if just as the bear who made you breakfast.",
    },
  },
};

const pudge_d7_mid: DialogueScript = {
  id: 'pudge_d7_mid',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "I've been up since four. Baking. Not because I'm nervous -- okay, a little nervous. But mostly because I wanted to give everyone something to remember.",
      next: 'wisdom',
    },
    wisdom: {
      id: 'wisdom',
      speaker: 'Pudge',
      text: "My grandmother always said: at the end of everything, the only thing that matters is whether you were kind. Not clever, not popular, not chosen. Just... kind. I think she was right.",
      choices: [
        {
          text: '"You\'re the kindest person I\'ve ever met."',
          condition: (v) => v.charm >= 55,
          lockMessage: 'Needs 55 charm',
          next: 'smooth',
          effects: { relationship_level: 8 },
        },
        {
          text: '"Your grandmother was a smart bear."',
          next: 'friendly',
          effects: { relationship_level: 6 },
        },
        {
          text: '"That\'s good advice for tonight."',
          next: 'cold',
          effects: { relationship_level: 4 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*voice breaks a little* I'm not... I'm just a bear who bakes and worries too much. But if you see kindness in me, then maybe... maybe that's enough.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "The smartest. She couldn't read very well, but she understood people better than anyone with a library card. I miss her every day.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "It's good advice for everything. I just hope I can live up to it when the moment comes. I get so tongue-tied...",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "I made you something for tonight. A little jar of honey from the garden. For when things feel bitter. Just add a spoonful.",
    },
  },
};

const pudge_d7_high: DialogueScript = {
  id: 'pudge_d7_high',
  startNode: 'start',
  nodes: {
    start: {
      id: 'start',
      speaker: 'Pudge',
      text: "Before tonight... before everything changes... I need to say something. And I'm going to try really hard not to mumble.",
      next: 'truth',
    },
    truth: {
      id: 'truth',
      speaker: 'Pudge',
      text: "I came to this island by accident. My friends signed me up as a joke. I showed up planning to leave on day one. But then I met you. And for the first time in my life, I didn't want to run back to my quiet mountain. I wanted to stay. Right here. With you.",
      choices: [
        {
          text: '"I don\'t want you to go back to that mountain without me."',
          condition: (v) => v.charm >= 60,
          lockMessage: 'Needs 60 charm',
          next: 'smooth',
          effects: { relationship_level: 12 },
        },
        {
          text: '"You\'ve changed so much this week. I\'m in awe."',
          next: 'friendly',
          effects: { relationship_level: 9 },
        },
        {
          text: '"Pudge, that really means a lot."',
          next: 'cold',
          effects: { relationship_level: 7 },
        },
      ],
    },
    smooth: {
      id: 'smooth',
      speaker: 'Pudge',
      text: "*takes your hands, trembling but steady* Then don't let me. Come to the mountain. I'll teach you to bake bread and we'll watch the snow fall and... and it'll be the quietest, warmest, best thing. I promise.",
      next: 'end',
    },
    friendly: {
      id: 'friendly',
      speaker: 'Pudge',
      text: "I haven't changed. I think I just... finally found someone who made it safe to be who I always was. The deep, bread-obsessed, overthinking bear. You saw all of that and you didn't look away.",
      next: 'end',
    },
    cold: {
      id: 'cold',
      speaker: 'Pudge',
      text: "It means a lot to me too. This whole week. Every quiet moment, every shared meal. You made a shy bear feel like he was worth listening to.",
      next: 'end',
    },
    end: {
      id: 'end',
      speaker: 'Pudge',
      text: "Whatever happens at the ceremony... you already gave me the thing I came looking for. You taught me that I don't have to be loud to be loved.",
    },
  },
};

// ---------------------------------------------------------------------------
// Export: 7 days × 3 tiers [low, mid, high]
// ---------------------------------------------------------------------------

export const PUDGE_DAILY: DialogueScript[][] = [
  [pudge_d1_low, pudge_d1_mid, pudge_d1_high],
  [pudge_d2_low, pudge_d2_mid, pudge_d2_high],
  [pudge_d3_low, pudge_d3_mid, pudge_d3_high],
  [pudge_d4_low, pudge_d4_mid, pudge_d4_high],
  [pudge_d5_low, pudge_d5_mid, pudge_d5_high],
  [pudge_d6_low, pudge_d6_mid, pudge_d6_high],
  [pudge_d7_low, pudge_d7_mid, pudge_d7_high],
];

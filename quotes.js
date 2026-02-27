// Bilingual Quote Database - EN/FR
// Philosophy & Spiritual Economics

const quotesData = {
    en: [
        // Philosophy & Spiritual Economics (Sage view)
        {
            text: "Finance should serve life, not the other way around.",
            author: "Aurora Manifesto"
        },
        {
            text: "Gold is not just a commodity. It's the bridge between the old world and the new — between extractive value and generative value.",
            author: "Tommy Suzanne"
        },
        {
            text: "Every moment is a chance to seize.",
            author: "Tommy Suzanne"
        },
        {
            text: "Do what you love, and you’ll know it’s right if you can find a purpose for humanity in it.",
            author: "Tommy Suzanne"
        },
        {
            text: "We do one thing the way we do everything.",
            author: "Tommy Suzanne"
        },
        {
            text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
            author: "Bhagavad Gita"
        },
        {
            text: "Do your duty. Keep your focus on Him.",
            author: "Anandamayi Ma"
        },
        {
            text: "Work is love made visible.",
            author: "Khalil Gibran"
        },
        {
            text: "Mind precedes all mental states. Mind is their chief; they are all mind-wrought.",
            author: "Siddhartha Gautama"
        },
        {
            text: "For where your treasure is, there your heart will be also.",
            author: "Jesus"
        },
        {
            text: "Life does not consist in the abundance of possessions.",
            author: "Jesus"
        },
        {
            text: "A journey of a thousand miles begins with a single step.",
            author: "Lao Tzu"
        },
        {
            text: "No man is free who cannot control himself.",
            author: "Pythagoras"
        },
        {
            text: "Number rules the universe.",
            author: "Pythagoras"
        },

        // Additional sages
	        {
	            text: "What you seek is seeking you.",
	            author: "Rumi"
	        },
	        {
	            text: "First say to yourself what you would be; and then do what you have to do.",
	            author: "Epictetus"
	        },
        {
            text: "It does not matter how slowly you go as long as you do not stop.",
            author: "Confucius"
        },
        {
            text: "He who knows he has enough is rich.",
            author: "Lao Tzu"
        },
        {
            text: "Give, and it will be given to you.",
            author: "Jesus"
        },
	        {
	            text: "Drop by drop is the water pot filled.",
	            author: "Siddhartha Gautama"
	        },
	        
	        // Omraam Mikhaël Aïvanhov
	        {
	            text: "True gold is the condensed light of the sun.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "Instead of chasing money, work to become a magnet that attracts wealth.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "The true wealth is the one no one can take from you: your inner light.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "The celestial economy rests on the law of harmonious exchange: giving and receiving in perfect balance.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "He who sows in the invisible reaps in the visible.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "Patience is the gold of the wise. It transforms time into an ally.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "The future belongs to those who understand that true economy is solar: giving without becoming impoverished.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "Don't seek to possess gold, seek to become like it: unalterable and luminous.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "Abundance comes to those who understand the laws of universal circulation.",
            author: "Omraam Mikhaël Aïvanhov"
        }
    ],
    
    fr: [
        // Philosophie & économie spirituelle (regard de sage)
        {
            text: "La finance devrait servir la vie, pas l'inverse.",
            author: "Aurora Manifesto"
        },
        {
            text: "L'or n'est pas qu'une commodité. C'est le pont entre l'ancien monde et le nouveau — entre la valeur extractive et la valeur générative.",
            author: "Tommy Suzanne"
        },
        {
            text: "Chaque instant est une chance à saisir.",
            author: "Tommy Suzanne"
        },
        {
            text: "Fais ce que tu aimes et tu sauras que c’est juste si tu peux y trouver un but pour l’humanité.",
            author: "Tommy Suzanne"
        },
        {
            text: "On fait une chose comme on fait toute chose.",
            author: "Tommy Suzanne"
        },
        {
            text: "Vous avez le droit d'accomplir votre devoir, mais vous n'êtes pas en droit d'exiger les fruits de vos actes.",
            author: "Bhagavad Gita"
        },
        {
            text: "Fais ton devoir. Garde ton attention sur Lui.",
            author: "Anandamayi Ma"
        },
        {
            text: "Le travail est l'amour rendu visible.",
            author: "Khalil Gibran"
        },
        {
            text: "L'esprit précède tous les états. Il en est le chef; tout est façonné par l'esprit.",
            author: "Siddhartha Gautama"
        },
        {
            text: "Car là où est ton trésor, là aussi sera ton cœur.",
            author: "Jésus"
        },
        {
            text: "La vie ne dépend pas de l'abondance des biens.",
            author: "Jésus"
        },
        {
            text: "Un voyage de mille lieues commence par un pas.",
            author: "Lao Tseu"
        },
        {
            text: "Nul n'est libre s'il ne se maîtrise pas.",
            author: "Pythagore"
        },
        {
            text: "Le nombre gouverne l'univers.",
            author: "Pythagore"
        },

        // Autres sages
	        {
	            text: "Ce que tu cherches te cherche.",
	            author: "Rûmî"
	        },
	        {
	            text: "Dis-toi d'abord ce que tu veux être, puis fais ce que tu as à faire.",
	            author: "Épictète"
	        },
        {
            text: "Peu importe la lenteur à laquelle tu avances tant que tu ne t'arrêtes pas.",
            author: "Confucius"
        },
        {
            text: "Celui qui sait qu'il a assez est riche.",
            author: "Lao Tseu"
        },
        {
            text: "Donnez, et l'on vous donnera.",
            author: "Jésus"
        },
	        {
	            text: "Goutte à goutte se remplit la jarre.",
	            author: "Siddhartha Gautama"
	        },
	        
	        // Omraam Mikhaël Aïvanhov
	        {
	            text: "L'or véritable, c'est la lumière du soleil condensée.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "Au lieu de courir après l'argent, travaillez à devenir un aimant qui attire la richesse.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "La vraie richesse est celle que personne ne peut vous enlever : votre lumière intérieure.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "L'économie céleste repose sur la loi de l'échange harmonieux : donner et recevoir en équilibre parfait.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "Celui qui sème dans l'invisible récolte dans le visible.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "La patience est l'or du sage. Elle transforme le temps en allié.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "L'avenir appartient à ceux qui comprennent que la vraie économie est solaire : donner sans s'appauvrir.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "Ne cherchez pas à posséder l'or, cherchez à devenir comme lui : inaltérable et lumineux.",
            author: "Omraam Mikhaël Aïvanhov"
        },
        {
            text: "L'abondance vient à celui qui a compris les lois de la circulation universelle.",
            author: "Omraam Mikhaël Aïvanhov"
        }
    ]
};

// Expose for other scripts (script.js expects window.quotesData).
if (typeof globalThis !== 'undefined') {
    globalThis.quotesData = quotesData;
}

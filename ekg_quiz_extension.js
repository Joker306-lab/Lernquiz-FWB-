const ekgCategories = [
  {
    category: "EKG Rhythmus",
    questions: [
      {
        question: "Welche Aussage spricht für einen Sinusrhythmus?",
        answers: [
          "Keine P-Wellen sichtbar",
          "Jede P-Welle wird von einem QRS-Komplex gefolgt",
          "QRS-Komplex verbreitert",
          "Unregelmäßige RR-Abstände"
        ],
        correct: 1
      }
    ]
  },
  {
    category: "EKG Bildfragen",
    questions: [
      {
        type: "image",
        image: "assets/ekg/ekg001.png",
        question: "Welche Rhythmusstörung ist hier am ehesten zu erkennen?",
        answers: [
          "Sinusrhythmus",
          "Vorhofflimmern",
          "AV-Block I°",
          "Sinusbradykardie"
        ],
        correct: 1
      }
    ]
  }
];

quizData.push(...ekgCategories);

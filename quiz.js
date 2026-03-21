const questions=[
{
question:"Was bedeutet das C im xABCDE Schema?",
answers:["Control","Core","Circulation","Cardio"],
correct:2
},
{
question:"Was gehört zu den Nierenwerten?",
answers:["CRP","Kreatinin, Harnstoff, eGFR","Bilirubin","Kalium"],
correct:1
}
];

let i=0;
const q=document.getElementById("question");
const a=document.getElementById("answers");

function load(){
q.textContent=questions[i].question;
a.innerHTML="";
questions[i].answers.forEach((ans,index)=>{
const b=document.createElement("button");
b.className="answer";
b.textContent=ans;
b.onclick=()=>{
if(index===questions[i].correct){
b.classList.add("correct");
correctSound();
}else{
b.classList.add("wrong");
wrongSound();
}
};
a.appendChild(b);
});
}

function back(){window.location="index.html"}

load();
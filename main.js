var questName = "";

const firebaseConfig = {
  apiKey: "AIzaSyCsjPIiAS-iYIZgd6BzfqeZZoeGbbQYHxQ",
  authDomain: "historico-de-texto.firebaseapp.com",
  databaseURL: "https://historico-de-texto-default-rtdb.firebaseio.com",
  projectId: "historico-de-texto",
  storageBucket: "historico-de-texto.appspot.com",
  messagingSenderId: "312597574215",
  appId: "1:312597574215:web:39ae7d100dc9c229ebb762"
};

firebase.initializeApp(firebaseConfig);

function getData() {
  firebase.database().ref("/").on('value', function (snapshot) {
    document.getElementById("output").innerHTML = "";
    snapshot.forEach(function (childSnapshot) {
      childKey = childSnapshot.key;
      questNames = childKey;
      console.log("Quest - " + questNames);
      row = "<hr><div class='questDiv' onclick='redirectQuest(this.innerHTML)'>" + questNames + "</div><br><br>";
      document.getElementById("output").innerHTML += row;
    });
  });
}

function redirectQuest(q){
  localStorage.setItem("quiz", q);
  window.location = "quest.html";
}

//Criando Questionário

function createQuiz() {
  quiz = document.getElementById("quizname").value;
  if (!quiz == "") {
    questName = quiz
    firebase.database().ref(quiz).update({
      name: quiz
    });
    document.getElementById("name").style.visibility = "hidden";
    document.getElementById("questionData").style.visibility = "visible";
    document.getElementById("bottom-bar").innerHTML = "<p>" + questName + "</p><button onclick='testCreated()'>Concluído</button>"
  }
}

function sendQuest() {
  Qask = document.getElementById("questionAsk").value;
  Qanswer = document.getElementById("questionAnswer").value;
  Qvalue = Number(document.getElementById("questionValue").value);
  if (!Qask == "" || Qanswer == "" || Qvalue == "") {
    firebase.database().ref(quiz).push({
      question: Qask,
      answer: Qanswer,
      value: Qvalue
    });
    document.getElementById("questionAsk").value = "";
    document.getElementById("questionAnswer").value = "";
    document.getElementById("questionValue").value = "";
  }
}

function testCreated() {
  localStorage.setItem("quiz", questName);
  window.location = "creator_status.html";
}

function status() {
  thisquest = localStorage.getItem("quiz");
  var NumberOfQuestions = 0;
  var NumberOfValue = 0;
  firebase.database().ref("/" + thisquest).on('value', function (snapshot) {
    document.getElementById("QuestData").innerHTML = "";
    snapshot.forEach(function (childSnapshot) {
      childKey = childSnapshot.key; childData = childSnapshot.val();
      if (childKey != "name") {
        firebaseMessageId = childKey;
        questItem = childData;

        thequestion = questItem['question'];
        theanswer = questItem['answer'];
        thevalue = questItem['value'];

        NumberOfQuestions += 1;
        NumberOfValue += thevalue;

        row = "<div style='background-color:aliceblue'><hr><h1>Questão: " + thequestion + "</h1><h2>Resposta: " + theanswer + "</h2><p>Valor: " + thevalue + "</p></div>";

        document.getElementById("QuestData").innerHTML += row;

      } else {
        document.getElementById("QuestName").innerHTML = childData;
      }
    });
    document.getElementById("QN").innerHTML = "Numero de Questões: " + NumberOfQuestions;
    document.getElementById("QV").innerHTML = "Nota Total: " + NumberOfValue;
  });
}

function returnToPage() {
  window.location = "index.html";
}

//Resolvendo Questionário
var allQuestions = [];

var nowQuest = 0;
var nowValue = 0;
var nowAnswer = "";
var nowquestion = "";

var score = 0;
var corrects = [];
var yourAnswers = [];

function QuizData() {
  thisquest = localStorage.getItem("quiz");
  firebase.database().ref("/" + thisquest).on('value', function (snapshot) {
    allQuestions = [];
    NumberOfQuestions = 0;
    snapshot.forEach(function (childSnapshot) {
      childKey = childSnapshot.key; childData = childSnapshot.val();
      if (childKey != "name") {
        firebaseMessageId = childKey;
        questItem = childData;

        thequestion = questItem['question'];
        theanswer = questItem['answer'];
        thevalue = questItem['value'];

        NumberOfQuestions++;

        allQuestions.push([
          thisQuestion = thequestion,
          thisAnswer = theanswer,
          thisValue = thevalue
        ]);

        console.log(allQuestions);

      } else {
        document.getElementById("QuestName").innerHTML = childData;
      }
    });
    setTimeout(loadQuestion(),500);
  });
}

function loadQuestion(){
  if(nowQuest < NumberOfQuestions){
  nowquestion = allQuestions[nowQuest][0];
  nowAnswer = allQuestions[nowQuest][1];
  nowValue = allQuestions[nowQuest][2];

  document.getElementById("QuestionQuest").innerHTML = nowquestion;
  document.getElementById("questionValue").innerHTML = nowValue;

  document.getElementById("nowquestion").innerHTML = nowQuest + 1;
  }else{
    conclusion();
  }
}

function Next(){
  if(!document.getElementById("yourAnswer").value == ""){
    if(document.getElementById("yourAnswer").value == nowAnswer){
      score = score + nowValue;
      console.log(score);
      corrects.push(true);
    }else{
      corrects.push(false);
    }
    yourAnswers.push(document.getElementById("yourAnswer").value);
    document.getElementById("yourAnswer").value = "";
    nowQuest++;
    loadQuestion();
  }
}

function conclusion(){
  localStorage.setItem("finalscore",score);
  correctsJson = JSON.stringify(corrects);
  localStorage.setItem("corrects",correctsJson);
  yourAnswersJson = JSON.stringify(yourAnswers)
  localStorage.setItem("youranswers",yourAnswersJson);

  window.location = "your_score.html";
}

function score_status() {
  thisquest = localStorage.getItem("quiz");
  playerAnswers = JSON.parse(localStorage.getItem("youranswers"));
  playerscore = localStorage.getItem("finalscore");
  playercorrects = JSON.parse(localStorage.getItem("corrects"));
  totalcorrects = 0;
  var NumberOfQuestions = 0;
  var NumberOfValue = 0;
  firebase.database().ref("/" + thisquest).on('value', function (snapshot) {
    document.getElementById("QuestData").innerHTML = "";
    snapshot.forEach(function (childSnapshot) {
      childKey = childSnapshot.key; childData = childSnapshot.val();
      if (childKey != "name") {
        firebaseMessageId = childKey;
        questItem = childData;

        thequestion = questItem['question'];
        theanswer = questItem['answer'];
        thevalue = questItem['value'];

        NumberOfQuestions += 1;
        NumberOfValue += thevalue;

        if(playercorrects[NumberOfQuestions-1] == true){
        row = "<div style='background-color:lime'><hr><h1>Questão: " + thequestion + "</h1><h2>Resposta: " + theanswer + "</h2><h3>Sua Resposta: "+playerAnswers[NumberOfQuestions -1]+"<p>Valor: " + thevalue + "</p></div>";
        totalcorrects++;
        }else{
          row = "<div style='background-color:red'><hr><h1>Questão: " + thequestion + "</h1><h2>Resposta: " + theanswer + "</h2><h3>Sua Resposta: "+playerAnswers[NumberOfQuestions -1]+"<p>Valor: " + thevalue + "</p></div>";
        }

        document.getElementById("QuestData").innerHTML += row;

      } else {
        document.getElementById("QuestName").innerHTML = childData;
      }
    });
    document.getElementById("QC").innerHTML = "Questões Corretas: " +totalcorrects+"|"+ NumberOfQuestions;
    document.getElementById("QR").innerHTML = "Sua Nota: " +playerscore+"|"+ NumberOfValue;
  });
}
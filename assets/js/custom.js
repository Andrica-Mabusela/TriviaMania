// variables 
var questions = document.querySelectorAll('.question');
var difficultyLevels = document.querySelectorAll('.difficulty-level');
var answers = document.querySelectorAll('.answer');
var currentPossibleAnswers = [];
var answersArray = [];
var shuffledAnswers = [];
var ansObjs;
var answerResults = [];
var finalArray = [];
var questionCards = document.querySelectorAll('.question-card');
var score = 0;

function getQuestions(apiUrl){

    fetch(apiUrl)
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data)
        loadData(data)
        document.querySelector('.loader-wrapper').style.display = 'none';
        console.log('data received')

    })
    .catch(error => console.log(error) )

}


function loadData(data){

    for(let index = 0; index < questions.length; index++){
        currentPossibleAnswers = [data.results[index].correct_answer, ...data.results[index].incorrect_answers ]
        // console.log(currentPossibleAnswers)

        answersArray.push(currentPossibleAnswers)
    }



    for(let i = 0; i < answersArray.length; i++){

        ansObjs = [
            { answer: answersArray[i][0], correct: true },
            { answer: answersArray[i][1], correct: false },
            { answer: answersArray[i][2], correct: false },
            { answer: answersArray[i][3], correct: false }
        ]

        shuffledAnswers = ansObjs.sort( () => Math.random() - 0.5 )

        answerResults.push(shuffledAnswers)
        
    }

    for(let i = 0; i < answerResults.length; i++){

        for(let j = 0; j < 4; j++){
            finalArray.push( answerResults[i][j] )
        }
    }

    console.log(finalArray)

    // insert question and difficulty level
    for(let index = 0; index < questions.length; index++){
        questions[index].innerHTML += data.results[index].question;
        difficultyLevels[index].innerHTML += data.results[index].difficulty;
    }



    // insert answers into the document
    for(let index = 0; index < answers.length; index++){
        answers[index].innerHTML = finalArray[index].answer;

        if( finalArray[index].correct ){
            answers[index].classList.add('correct-answer')
        }
    }


    // listen for click events on buttons
    questionCards.forEach(card => {

        card.addEventListener('click', event => {

            if(event.target.classList.contains('answer') ){
    
                if(event.target.classList.contains('correct-answer') ){
                    console.log('correct answer is clicked!')
                    score++;

                    let overlay =  event.target.parentElement.parentElement.firstElementChild;
                    overlay.style.display = 'flex';
                    overlay.querySelector('.answer-state').innerText = 'correct answer'
                    document.querySelector('#score').innerText = score
                    console.log(score)
                }else{
                    console.log('Incorrect answer is clicked')

                    let overlay =  event.target.parentElement.parentElement.firstElementChild;
                    overlay.style.display = 'flex';
                    overlay.querySelector('.answer-state').innerText = 'wrong answer'

                }
            }
        
    })
    

})

}



// loader animation
let loaderTimeline = new gsap.timeline({defaults: {yoyo: true}});

loaderTimeline.to('.loader-circle-1', {duration: 0.5, backgroundColor: 'red', ease: 'linear'})
              .to('.loader-circle-2', {duration: 0.5, backgroundColor: 'red', ease: 'linear'})
              .to('.loader-circle-3', {duration: 0.5, backgroundColor: 'red', ease: 'linear'})
              .to('.loader-circle-4', {duration: 0.5, backgroundColor: 'red', ease: 'linear'})
              .to('.loader-circle-5', {duration: 0.5, backgroundColor: 'red', ease: 'linear'})

    setInterval(() => {
        loaderTimeline.restart();
    }, 2600)






    let saveBtn = document.querySelector('.save-btn');
    saveBtn.addEventListener('click', showScore)
    let x = document.querySelector('.score-overlay');
    let y = document.querySelector('.score-info');

    console.log(x);
    console.log(y);

    function showScore(){
        x.style.display = 'block';
        y.style.display = 'block';
        
        console.log(x);
        console.log(y);
    }
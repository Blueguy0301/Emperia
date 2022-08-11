import { React, useEffect } from 'react'
import '../styles/About.scss'
import { Link } from 'react-router-dom'

function About() {
  useEffect(() => {
    window.scrollTo(0, 0)
  })
  return (
    <div className="About-bg">
      <div className="About-head">
        <br />
        <div className="About-btn-back Btn-Primary">
          <Link to="/">Back</Link>
        </div>
      </div>
      <div className="About-body">
        <div className="About-body-developer">
          <div className="About-body-leaddeveloper">
            <h2>Lead Developer :</h2>
            <br />
            <img src="/assets/EmperiaDevLogoS/Maminta_profile.jpg" alt="" />
            <h1>Angelo A. Maminta</h1>
            <p>
              The leader of the research, the main lead, Angelo is a random guy
              who likes to code and play games on his free time. He is a
              self-taught programmer and has been coding since he was a kid. His
              passion for coding and computers when he was a kid leads to him
              being a programmer and an engineer.
            </p>
          </div>
          <div className="About-body-backenddeveloper">
            <h2>Backend Developer :</h2>
            <br />
            <img src="/assets/EmperiaDevLogoS/Sadsad_profile.jpg" alt="" />
            <h1>Prinze Mikhail V. Sadsad</h1>
            <p>
              The Backend developer who knows programming languages of C#, Java,
              and JavaScript. Prinze is responsible for maintaining the behind-the-scenes 
              of our operations. he is responsible for maintaining and troubleshooting 
              data when there happens to be a bug or a fatal flaw on the system.

            </p>
          </div>
          <div className="About-body-frontenddeveloper-1">
            <h2>Frontend Developer :</h2>
            <br />
            <img src="/assets/EmperiaDevLogoS/Cabrera_profile.jpg" alt="" />
            <h1>Mark Alexis J. Cabrera</h1>
            <p>
              The Frontend developer who wanted to learn how to program because
              he was influenced by his friends and parents. He always wanted
              to play games, fiddle with cellphones, and watch stuff about
              History, Sci-fi, and Technology. Mark is the senior developer 
              that focuses on the functionality and reliability of our systems.
            </p>
            <br />
          </div>
          <div className="About-body-frontenddeveloper-2">
            <br />
            <img src="/assets/EmperiaDevLogoS/Orcino_profile.jpg" alt="" />
            <h1>Allen Jefferson C. Orcino</h1>
            <p>
              The Another Frontend developer wants to learn a programming
              language because he wants to have the knowledge to be good at
              coding to be a programmer.
            </p>
          </div>
          <div className="About-body-moderator-1">
            <h2>Moderator :</h2>
            <br />
            <img src="/assets/EmperiaDevLogoS/Labay_profile.jpg" alt="" />
            <h1>Nashibah Labay</h1>
            <p>
              Not focusing too much of herself. Nashibah instead likes to 
              understand who are sitting in the audience. What  they are 
              looking for from the panel, and how could the speakers' sharing 
              relate to them.
            </p>
            <br />
          </div>
          <div className="About-body-moderator-2">
            <br />
            <img src="/assets/EmperiaDevLogoS/Fernandez_profile.jpg" alt="" />
            <h1>Antonette Fernandez</h1>
            <p>
              Antonette utilizes her skills and passion to further the mission 
              of the company. Bringing forth a positive attitude and a desire 
              to learn new skills.
            </p>
          </div>
        </div>
        <div className="About-body-project">
          <h2>About the Research :</h2>
          <p>
            This research is a project of a reseach group in STI College
            Alabang. This research aims to develop a web application that will
            help both the students and the faculty of STI College Alabang on
            virtual event managements and the likes.
          </p>
        </div>
        <br />
      </div>
    </div>
  )
}

export default About

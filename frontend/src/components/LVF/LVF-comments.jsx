import Usercomment from './LVF-usercomment'
import CommentBoxModal from '../CommentBox-Modal'
function LVFComment ({InviteCode}) {
  const code = InviteCode
    return (
      <div className="LVF-Comments"> 
      <br/> <p></p>
          <div className="LVF-Comments-BG">
            <div className="LVF-Usercomment">
          <CommentBoxModal code={code} />
           
            </div>
            <div className="LVF-Comments-btns">
              <div className="LVF-Comments-Enter">
                <div className="LVF-Comments-InputBar"><input className="LVF-Comments-Input" type="text" placeholder="Enter your Comment here..."/></div>
                <a href="#" className="LVF-Comments-enter-btn"><span><i className="fas fa-paper-plane"></i></span></a>     
                  <div className="LVF-dropup">
                  <a href="#" className="LVF-Comments-emoji-btn"><span><i className="fas fa-smile"></i></span></a>
                    <div className="LVF-dropup-emoji">
                    <center>
                    <a href="#" className="LVF-commentemoji"><span><i className="fas fa-thumbs-up"></i></span></a>
                    <a href="#" className="LVF-commentemoji"><span><i className="fas fa-heart"></i></span></a>
                    <a href="#" className="LVF-commentemoji"><span><i className="fas fa-grin-squint"></i></span></a>
                    <a href="#" className="LVF-commentemoji"><span><i className="fas fa-frown"></i></span></a>
                    <a href="#" className="LVF-commentemoji"><span><i className="fas fa-angry"></i></span></a>
                    </center>
                    </div>
                  </div>
                  <div className="LVF-dropup-3dots">
                  <a href="#" className="LVF-Comments-3dots-btn"><span><i className="fas fa-ellipsis-h"></i></span></a>
                    <div className="LVF-dropup-3dots-content">
                    <a href="#" className="LVF-comment3dots"><span>Comments</span></a>
                    {/* <a href="#" className="LVF-comment3dots"><span>Super Chat</span></a> */}
                    </div>
                  </div>
              </div>
            </div>
          </div>
      </div>    
        
    );
}

export default LVFComment 
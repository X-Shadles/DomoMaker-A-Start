const handleTwit = (e) => {
    e.preventDefault();

    $('#twitMessage').animate({ width: 'hide' }, 350);

    if ($('#twitTweet').val() == '') {
        handleError('come on theres only one requirement');
        return false;
    }

    sendAjax('POST', $('#twitForm').attr('action'), $('#twitForm').serialize(), function () {
        loadTwitsFromServer();
    });

    return false;
}

//the form that accepts new tweets
const TwitForm = (props) => {
    return (
        <form id="twitForm"
            onSubmit={handleTwit}
            name="twitForm"
            action="/maker"
            method="POST"
            className="twitForm">
            <label htmlFor="tweet"></label>
            <textarea rows="4" cols="50" type="text" id="twitTweet" name="tweet"></textarea>

            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeTwitSubmit" type="submit" value="Tweet" />
        </form>
    );
};

//list all the tweets and return their values
const TwitList = function (props) {
    if (props.twits.length === 0) {
        return (
            <div className="twitList">
                <h3 className="emptyTwit">No Tweets Exist</h3>
            </div>
        )
    }

    const twitNodes = props.twits.map(function (twit) {

        return (
            <div className="twit">
                <div className="twitTweet">
                <h3 className="twitName">{twit.username}:</h3>
                <h3 className="twitText">{twit.tweet}</h3> 
                <h3 className="twitTest">{twit.createdDate}</h3> 
                </div>
            </div>
        );
    });

    // reverse can mess with both consts, so a protect const keeps the nodes safe.
    const protectNodes = twitNodes;
    const reverseNodes = protectNodes.reverse();

    return (
        <div className="twitList">
            {reverseNodes}
        </div>
    );
};


//ad
const AdHere = function(){
    return(
        <div className="reactAd" >
        <h2>React Ad Here</h2>
        </div>
    );
}

//re-creates the content area to overwite passchange
const ContentSetup = () => {
    return (
  <section id="AllContent">
  <section id="makeTwit">
  </section>
  <section id="twits">
  </section>
  </section>
    );
};

//loading all the tweets
const loadTwitsFromServer = () => {
    sendAjax('GET', '/getTwits', null, (data) => {
        ReactDOM.render(
            <TwitList twits={data.twits} username={data.username}/>, document.querySelector('#twits')
        );
    });
};

//loadign personal tweets
const loadPersonalFromServer = () => {
    sendAjax('GET', '/getHome', null, (data) => {
        ReactDOM.render(
            <TwitList twits={data.twits} username={data.username}/>, document.querySelector('#twits')
        );
    });
};

//prints out the form of the tweets without any values
const tweetPublic = (csrf) => {
    
    ReactDOM.render(
        <ContentSetup/> ,document.querySelector('#content')
    );
    ReactDOM.render(
        <TwitForm csrf={csrf} />, document.querySelector('#makeTwit')
    );
    ReactDOM.render(
        <TwitList twits={[]} /> ,document.querySelector('#twits')
    );
}

//pritns out the passchange window
const createPassChange = (csrf) => {
    ReactDOM.render(
        <PassWindow csrf={csrf} />,
    document.querySelector('#content')
    );
};

const setup = function(csrf) {
    const passChange = document.querySelector('#passChange');
    const twitHome = document.querySelector('#twitHome');
    const twitPersonal = document.querySelector('#twitPersonal');

    passChange.addEventListener("click", (e) => {
        e.preventDefault();
        createPassChange(csrf);
        return false;
    });

    twitHome.addEventListener("click", (e) => {
        e.preventDefault();

        tweetPublic(csrf);
        loadTwitsFromServer(); //adds the vales to the tweet public
        return false;
    });

    
    twitPersonal.addEventListener("click", (e) => {
        e.preventDefault();

        tweetPublic(csrf);
        loadPersonalFromServer();//adds the vales to the tweet public
        return false;
    });

    tweetPublic(csrf);
    loadTwitsFromServer();

    ReactDOM.render(
        <AdHere/> ,document.querySelector('#left-grids') //ads
    );
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});


 //looks at change pass fields
const changePassword = (e) => {
    e.preventDefault();

    if ($('#oldpass').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
        handleError("all fields required");
        return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
        handleError("passwords arn't the same");
        return false;
    }

    sendAjax('POST', $('#passForm').attr('action'), $('#passForm').serialize(), redirect);

    return false;
};

//form for change password
const PassWindow = (props) => {
    return (
        <form id="passForm" name="passForm"
            onSubmit={changePassword}
            action="/changePass"
            method="POST"
            className="mainForm">
            <label htmlFor="oldpass"></label>
            <input id="oldpass" type="password" name="oldpass" placeholder="password" />
            <label htmlFor="pass"></label>
            <input id="pass" type="password" name="pass" placeholder="new password" />
            <label htmlFor="pass2"></label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
        
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id="passwordButtonTime" className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

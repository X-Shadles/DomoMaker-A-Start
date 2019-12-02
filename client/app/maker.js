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
                <h3 className="twitTweet">{twit.username}: {twit.tweet}</h3>
            </div>
        );
    });

    return (
        <div className="twitList">
            {twitNodes}
        </div>
    );
};

const loadTwitsFromServer = () => {
    sendAjax('GET', '/getTwits', null, (data) => {
        ReactDOM.render(
            <TwitList twits={data.twits} username={data.username}/>, document.querySelector('#twits')
        );
    });
};

const setup = function(csrf) {

    document.querySelector("#passChange").addEventListener("click", (e) => {
        e.preventDefault();
        ReactDOM.render(
            <PassWindow csrf={csrf} />,
        document.querySelector('#content')
        );
        return false;
    });

    ReactDOM.render(
        <TwitForm csrf={csrf} />, document.querySelector('#makeTwit')
    );

    ReactDOM.render(
        <TwitList twits={[]} /> ,document.querySelector('#twits')
    );

    loadTwitsFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});


 
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

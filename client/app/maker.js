let domoRenderer;
let domoForm;
let DomoFormClass;
let DomoListClass;

const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:"hide"}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        domoRenderer.loadDomosFromServer();
    });
    
    return false;
};

const renderDomo = function() {
    return(
    <form id="domoForm"
        onSubmit={this.handleSubmit}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
        >
        
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <input type="hidden" name="_csrf" value={this.props.csrf}/>
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
    );
};

const renderDomoList = function() {
    if(this.state.data.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = this.state.data.map(function(domo){
        
        //console.dir(domo.image);
        return (
            <div key={domo._id} className="domo">
            <img src={domo.image} alt="domo face" className="domoFace"/>
            <h3 className="domoName"> Name: {domo.name}</h3>
            <h3 className="domoAge"> Age: {domo.age}</h3>
            <img src={domo.image} className="canvasSize" alt="domo face"/>
            <canvas ref={(input)=>{
            console.dir(input);
var ctx=input.getContext("2d");
ctx.rect(0,0,300,300);
ctx.fill();
                                  }} className="domoCanvas canvasSize">Image manipulation unsupported in your browser</canvas>
            <button className="domoUpdate" >Update Face</button>
            </div>
        );
        
        return(
            <div className="domoList">
            {domoNodes}
            </div>
        )
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const setup = function(csrf) {
    
    DomoFormClass = React.createClass({
        handleSubmit: handleDomo,
        render: renderDomo,
    });
    
    DomoListClass = React.createClass({
        loadDomosFromServer : function () {
            sendAjax('GET', '/getDomos', null, function(data){
                this.setState({data:data.domos});
            }.bind(this));
        },
        getInitialState: function() {
            return {data: []};
        },
        componentDidMount: function() {
            this.loadDomosFromServer();
            //var $this = $(ReactDOM.findDOMNode(this));
            //// set el height and width etc.
        },
        render: renderDomoList
    });
    
    domoForm = ReactDOM.render(
        <DomoFormClass csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    domoRenderer = ReactDOM.render(
        <DomoListClass />, document.querySelector("#domos")
    );
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(function(){
    getToken();
});
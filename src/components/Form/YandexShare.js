import React from 'react';
import PropTypes from 'prop-types';
//import "./YandexShare.css";
//import {gaEvents} from '../GoogleAnalytics/gaEvents';

class YandexShare extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      show: true
    }
  
    this.containerRef = React.createRef();
    this.showShare = this.showShare.bind(this);
  
    this.defaultOptions = {
      contentByService: {
        facebook: {
          //url: url,
          accessToken: 'EAAEzmtR9T48BAAS0rbKeZB5p3cmgpKZC6ZAIfz9PC5OMLGvGZBdxDZB6cOBQ7GkevlLrnv6uILHlHzGenZBGp1O9OB4PIHtTn81OZCFZAp3PTnBqhb2Ypb6Qfz8cQRSm1SAcrgVYpjEEqBzr1F4byLIYq8kh01alnmEmWmzcZCTvchdGgtUaYSRwRKpGy3KAorHQZD' //'EAAdLUeulqdMBAFlSFt02nTWVfYUP4Q2YiGB2UfLK7m4EQ0K3vS7JiJ4Gdhvz5rLtoiTIfLTY7fAlvzuZAvlahrvf25Hf9ZBrZBGWwdyDsRnKXri2ZBIHOOva07IyJPu16elDeb6WkVUkRukvC6jEHDZAW2aaE2O8ZD'
        }
      },
      hooks: {
        onshare: function(name) {
          //console.log('нажата кнопка' + name);
          var event = {hitType: 'event', eventCategory: 'SpShare', eventAction: 'ShareButton_'+props.place+'_'+name, eventLabel: 'ShareButton '+name};
          //gaEvents.sendEvent(event);
        }
      }
    }
    

  }

  UNSAFE_componentWillMount() {
    if ((typeof window === 'object') && (!('Ya' in window) || (typeof window.Ya.share2 !== 'function'))) {
      const script = document.createElement("script");
      script.src = "https://yastatic.net/share2/share.js";
      script.async = true;
      script.onload = () => this.componentDidMount();

      document.body.appendChild(script);
    }
  }

  componentDidMount() {
    this.shareOb = { ...this.props, ...this.defaultOptions};
    if (this.containerRef.current && (typeof window === 'object') && ('Ya' in window) && (typeof window.Ya.share2 === 'function')) {
      window.Ya.share2(this.containerRef.current, this.shareOb);
    }
  }
  
  componentDidUpdate(prevProps) {
    console.log('this.props', this.props);
  //if (prevProps.text !== this.props.text) {
    //this.updateAndNotify();
  //}
    this.shareOb = { ...this.props, ...this.defaultOptions};
    if (this.containerRef.current && (typeof window === 'object') && ('Ya' in window) && (typeof window.Ya.share2 === 'function')) {
      window.Ya.share2(this.containerRef.current, this.shareOb);
    }
}
  
  showShare(){
    this.setState({show:true});
  }

  render() {
    return (
      <div className={`social ${this.state.show ?  'social-open' : 'social-neopen'}`}>
        <div onClick={this.showShare} className='social-button'  >
          {/*<div className='social-caption'>{this.props.caption || 'ПОДЕЛИТЬСЯ'}</div>*/}
        </div>
        <div ref={this.containerRef} className="social-shares" />
       {/* <div>{this.props.content.title}</div>
        <div>{this.props.content.description}</div>
        <div>{this.props.content.image}</div>
        <div>{this.props.content.url}</div>*/}
        
      </div>
      
      
    );
  }
}

YandexShare.propTypes = {
  content: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),

  contentByService: PropTypes.object,

  theme: PropTypes.shape({
    bare: PropTypes.bool,
    copy: PropTypes.oneOf([ 'last', 'first', 'hidden' ]),
    counter: PropTypes.bool,
    direction: PropTypes.oneOf([ 'horizontal', 'vertical' ]),
    lang: PropTypes.oneOf([ 'az', 'be', 'en', 'hy', 'ka', 'kk', 'ro', 'ru', 'tr', 'tt', 'uk' ]),
    limit: PropTypes.number,
    nonce: PropTypes.string,
    popupDirection: PropTypes.oneOf([ 'bottom', 'top' ]),
    popupPosition: PropTypes.oneOf([ 'inner', 'outer' ]),
    services: PropTypes.string,
    size: PropTypes.oneOf([ 'm', 's' ]),
  }),

  hooks: PropTypes.shape({
    onready: PropTypes.func,
    onshare: PropTypes.func,
  }),
};

export default YandexShare;
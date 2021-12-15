import styles from './BotFrameworkChatPopupApplicationChat.module.scss';
import * as React from 'react';
import ReactWebChat from 'botframework-webchat';
import { DirectLine } from 'botframework-directlinejs';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ChatBotImage } from './chatBotImage';
import { IBotFrameworkChatPopupApplicationChatProps } from "./IBotFrameworkChatPopupApplicationChatProps";

export interface IBotFrameworkChatPopupApplicationChatState {
  directLine: any;
  styleSetOptions: any;
  isOpen: any;
}

export default class BotFrameworkChatPopupApplicationChat extends React.Component<IBotFrameworkChatPopupApplicationChatProps, IBotFrameworkChatPopupApplicationChatState> {
  constructor(props) {
    super(props);
    const styleOptions = {
      hideScrollToEndButton: false,
      rootHeight: '50%',
      rootWidth: '50%',
      //Change focus styles
      transcriptActivityVisualKeyboardIndicatorStyle: 'dashed',
      transcriptActivityVisualKeyboardIndicatorWidth: 1,
      transcriptVisualKeyboardIndicatorColor: 'Grey',
      transcriptVisualKeyboardIndicatorStyle: 'solid',
      transcriptVisualKeyboardIndicatorWidth: 1
    };
    this.state = {
      directLine: new DirectLine({
        secret: "<provide your directline secret here>"//this.props.directLineSecret
      }),
      styleSetOptions: styleOptions,
      isOpen: false
    };
  }

  public render() {
    return (
      <>
        <div className={styles.chatWindow}>
          {
            <>
              <div className={`${!this.state.isOpen ? styles.visible : styles.hidden} transition-element`}>
                {!this.isMobile ?
                  <section className={`${styles.avenueMessenger} ${styles.bottom}`} onClick={() => this.displayChatPop(true)}>
                    <div>
                      <Icon className={`ms-fontSize-18`} iconName={`ChatBot`} ></Icon>
                      Ask Jeffrey
                    </div>
                  </section>
                  :
                  <div>
                  </div>
                }
              </div>

              <div className={`${this.state.isOpen ? styles.visible : styles.hidden} transition-element`}>
                <section className={styles.avenueMessenger}>
                  <div className={styles.menu}>
                    <Icon iconName={`ChromeMinimize`} className={styles.button} onClick={() => this.displayChatPop(false)} ></Icon>
                  </div>
                  <div className={styles.agentFace}>
                    <div className={styles.half}>
                      <img className={styles.circle} src={ChatBotImage.base64} alt="SK BOT" /></div>
                  </div>
                  <div className={styles.chat}>
                    <div className={styles.chatTitle}>
                      <h1>Ask Jeffrey</h1>
                      <h2>EUS ChatBot</h2>
                    </div>
                    <div className={styles.messages} id={`chatMessages`}>
                      <ReactWebChat className={styles.BotFrameworkChatPopupApplicationChat} 
                      directLine={this.state.directLine} 
                      styleOptions={this.state.styleSetOptions} />
                    </div>
                  </div>
                </section>
              </div>
            </>
          }
        </div>
      </>
    );
  }

  private handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  /**
 * Minimizes or maximizes the chat pop
 * @param isCollapsed bool to make the chat pop collapse and open
 */
  private displayChatPop(isOpen: boolean): void {
    this.setState({ isOpen: isOpen });
  }

  private get isMobile(): boolean {

    return (navigator.userAgent.indexOf("Android") > -1
      || navigator.userAgent.indexOf("webOS") > -1
      || navigator.userAgent.indexOf("iPhone") > -1
      || navigator.userAgent.indexOf("iPad") > -1
      || navigator.userAgent.indexOf("iPod") > -1
      || navigator.userAgent.indexOf("BlackBerry") > -1
      || navigator.userAgent.indexOf("Windows Phone") > -1);
  }
}
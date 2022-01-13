import styles from './BotFrameworkChatPopupApplicationChat.module.scss';
import * as React from 'react';
import ReactWebChat, { createStore, createDirectLine } from 'botframework-webchat';
import { DirectLine } from 'botframework-directlinejs';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ChatBotImage } from './chatBotImage';
import { useMemo, useState, useEffect } from 'react';
import { ExtensionContext } from '@microsoft/sp-extension-base';
import { BotSignInToast } from './Notification/BotSignInToast';
import { TraditionalBotAuthenticationToast } from './Notification/TraditionalBotAuthenticationToast';

export interface IBotFrameworkChatPopupApplicationChatProps {
  context: ExtensionContext;
  directLineSecret: string;
  allowedSites: string[];
}

export const BotFrameworkChatPopupApplicationChat: React.FunctionComponent<IBotFrameworkChatPopupApplicationChatProps> = (props) => {

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

    const [directLine, setDirectLine] = useState(createDirectLine({}));
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setDirectLine(new DirectLine({
        secret: "_ZC8L1E9mH8.yxdQfRwQdMRVCwGqJ0le2vTONtw1CL5gW3fSBNbQTjE"//this.props.directLineSecret
      }));
    },[]);
  

  const toastMiddleware = () => (next) => ({ notification, ...otherArgs }) => {
    const { id } = notification;
    if (id === 'signin') {
      return <BotSignInToast notification={notification} context={props.context} />;
    } else if (id === 'traditionalbotauthentication') {
      return <TraditionalBotAuthenticationToast notification={notification} />;
    }
    return next({ notification, ...otherArgs });
  };

   const store = useMemo(
    () =>
      createStore({}, ({ dispatch }) => (next) => (action) => {
        if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY' && action.payload.activity.from.role === 'bot') {
          const activity =
            (action.payload.activity.attachments || []).find(
              ({ contentType }) => contentType === 'application/vnd.microsoft.card.oauth'
            ) || {};
          const { content } = activity;

          if (content) {
            const { tokenExchangeResource } = content;
            const { uri } = tokenExchangeResource;

            if (uri) {
              dispatch({
                type: 'WEB_CHAT/SET_NOTIFICATION',
                payload: {
                  data: { content },
                  id: 'signin',
                  level: 'info',
                  message: 'Please sign in to the app.',
                },
              });

              return false;
            }
          }
        }

        return next(action);
      }),
    []
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  /**
 * Minimizes or maximizes the chat pop
 * @param isCollapsed bool to make the chat pop collapse and open
 */
  const displayChatPop = (open: boolean) => {
    setIsOpen(open);
  };

  const isMobile = () => {

    return (navigator.userAgent.indexOf("Android") > -1
      || navigator.userAgent.indexOf("webOS") > -1
      || navigator.userAgent.indexOf("iPhone") > -1
      || navigator.userAgent.indexOf("iPad") > -1
      || navigator.userAgent.indexOf("iPod") > -1
      || navigator.userAgent.indexOf("BlackBerry") > -1
      || navigator.userAgent.indexOf("Windows Phone") > -1);
  };

  return (
    <>
      <div className={styles.chatWindow}>
        {
          <>
            <div className={`${!isOpen ? styles.visible : styles.hidden} transition-element`}>
                <section className={`${styles.avenueMessenger} ${styles.bottom}`} onClick={() => displayChatPop(true)}>
                  <div>
                    <Icon className={`ms-fontSize-18`} iconName={`ChatBot`} ></Icon>
                    Ask Jeffrey
                  </div>
                </section>
            </div>

            <div className={`${isOpen ? styles.visible : styles.hidden} transition-element`}>
              <section className={styles.avenueMessenger}>
                <div className={styles.menu}>
                  <Icon iconName={`ChromeMinimize`} className={styles.button} onClick={() => displayChatPop(false)} ></Icon>
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
                    directLine={directLine}
                    toastMiddleware={toastMiddleware}
                    store={store}
                    styleOptions={styleOptions} />
                  </div>
                </div>
              </section>
            </div>
          </>
        }
      </div>
    </>
  );
};
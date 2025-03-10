import React, { useEffect } from 'react';
import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';

const T_PATH = 'components.common.toast.Toast';

export type ToastProps = {
  content?: string;
  destroy: () => void;
  duration?: number;
  id: string;
  title?: string;
  type: 'error' | 'success';
};

const Toast = ({ content, destroy, duration = 6000, id, title, type }: ToastProps): JSX.Element => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      destroy();
    }, duration);

    return () => clearTimeout(timer);
  }, [destroy, duration]);

  const renderDefaultLabel = (): string => {
    let label = t(`${T_PATH}.errorLabel`);

    if (type === 'success') {
      label = t(`${T_PATH}.successLabel`);
    }

    return label;
  };

  const renderDefaultMessage = (): string => {
    let message = t(`${T_PATH}.defaultErrorMessage`);

    if (type === 'success') {
      message = t(`${T_PATH}.defaultSuccessMessage`);
    }

    return message;
  };

  return (
    <Notification
      autoClose
      autoCloseDuration={duration}
      className="custom-toast"
      closeButtonLabelText={t(`${T_PATH}.ariaCloseNotification`)}
      dismissible
      displayAutoCloseProgress
      label={title ? title : renderDefaultLabel()}
      onClose={destroy}
      position={'top-right'}
      size="default"
      type={type}
    >
      {content ? content : renderDefaultMessage()}
    </Notification>
  );
};

const shouldRerender = (prevProps: ToastProps, nextProps: ToastProps) => {
  return prevProps.id === nextProps.id;
};

export default React.memo(Toast, shouldRerender);

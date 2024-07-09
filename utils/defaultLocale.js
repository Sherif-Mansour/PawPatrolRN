import {createBaseStringSet} from '@sendbird/uikit-react-native';
import {enUS} from 'date-fns/locale';

const defaultLocale = createBaseStringSet({
  dateLocale: enUS,
  overrides: {
    GROUP_CHANNEL_LIST: {
      HEADER_TITLE: 'Channels',
      DIALOG_CHANNEL_NOTIFICATION:
        'Turn on notifications\nTurn off notifications',
      DIALOG_CHANNEL_LEAVE: 'Leave channel',
    },
    GROUP_CHANNEL: {
      LIST_BUTTON_NEW_MSG: number => `${number} new messages`,
      MESSAGE_BUBBLE_EDITED_POSTFIX: '(edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: () => '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: () => '(Cannot read this message)',
    },
    GROUP_CHANNEL_SETTINGS: {
      HEADER_TITLE: 'Channel information',
      HEADER_RIGHT: 'Edit',
      MENU_NOTIFICATION: 'Notifications',
      MENU_MEMBERS: 'Members',
      MENU_LEAVE_CHANNEL: 'Leave channel',
      MENU_MODERATION: 'Moderation',
      DIALOG_CHANGE_NAME: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_TITLE: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER: 'Enter name',
      DIALOG_CHANGE_NAME_PROMPT_OK: 'Save',
      DIALOG_CHANGE_NAME_PROMPT_CANCEL: 'Cancel',
      DIALOG_CHANGE_IMAGE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_TITLE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
    },
    GROUP_CHANNEL_MEMBERS: {
      HEADER_TITLE: 'Members',
    },
    GROUP_CHANNEL_CREATE: {
      HEADER_TITLE: 'New channel',
      HEADER_RIGHT: number => `Create (${number})`,
    },
    GROUP_CHANNEL_INVITE: {
      HEADER_TITLE: 'Invite users',
      HEADER_RIGHT: number => `Invite (${number})`,
    },
    GROUP_CHANNEL_MODERATION: {
      HEADER_TITLE: 'Moderation',
      MENU_OPERATORS: 'Operators',
      MENU_MUTED_MEMBERS: 'Muted members',
      MENU_BANNED_USERS: 'Banned users',
      MENU_FREEZE_CHANNEL: 'Freeze channel',
    },
    GROUP_CHANNEL_OPERATORS: {
      HEADER_TITLE: 'Operators',
    },
    GROUP_CHANNEL_REGISTER_OPERATOR: {
      HEADER_TITLE: 'Set as operators',
      HEADER_RIGHT: number => `Add (${number})`,
    },
    GROUP_CHANNEL_MUTED_MEMBERS: {
      HEADER_TITLE: 'Muted members',
    },
    GROUP_CHANNEL_BANNED_USERS: {
      HEADER_TITLE: 'Banned users',
    },
    OPEN_CHANNEL: {
      HEADER_SUBTITLE: number => `${number} participants`,
      MESSAGE_BUBBLE_EDITED_POSTFIX: '(edited)',
      MESSAGE_BUBBLE_UNKNOWN_TITLE: '(Unknown message type)',
      MESSAGE_BUBBLE_UNKNOWN_DESC: "Can't read this message.",
    },
    OPEN_CHANNEL_PARTICIPANTS: {
      HEADER_TITLE: 'Participants',
    },
    OPEN_CHANNEL_SETTINGS: {
      HEADER_TITLE: 'Channel information',
      HEADER_RIGHT: 'Edit',
      INFO_URL: 'URL',
      MENU_MODERATION: 'Moderation',
      MENU_PARTICIPANTS: 'Participants',
      MENU_DELETE_CHANNEL: 'Delete channel',
      DIALOG_CHANNEL_DELETE_CONFIRM_TITLE: 'Delete channel?',
      DIALOG_CHANNEL_DELETE_CONFIRM_OK: 'Delete',
      DIALOG_CHANNEL_DELETE_CONFIRM_CANCEL: 'Cancel',
      DIALOG_CHANGE_NAME: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_TITLE: 'Change channel name',
      DIALOG_CHANGE_NAME_PROMPT_PLACEHOLDER: 'Enter name',
      DIALOG_CHANGE_NAME_PROMPT_OK: 'Save',
      DIALOG_CHANGE_NAME_PROMPT_CANCEL: 'Cancel',
      DIALOG_CHANGE_IMAGE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_TITLE: 'Change channel image',
      DIALOG_CHANGE_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_CHANGE_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
    },
    OPEN_CHANNEL_LIST: {
      HEADER_TITLE: 'Channels',
    },
    OPEN_CHANNEL_CREATE: {
      HEADER_TITLE: 'New channel',
      HEADER_RIGHT: 'Create',
      PLACEHOLDER: 'Enter channel name',
      DIALOG_IMAGE_MENU_REMOVE: 'Remove photo',
      DIALOG_IMAGE_MENU_CAMERA: 'Take photo',
      DIALOG_IMAGE_MENU_PHOTO_LIBRARY: 'Choose photo',
    },
    OPEN_CHANNEL_MODERATION: {
      HEADER_TITLE: 'Moderation',
      MENU_OPERATORS: 'Operators',
      MENU_MUTED_PARTICIPANTS: 'Muted participants',
      MENU_BANNED_USERS: 'Banned users',
    },
    OPEN_CHANNEL_BANNED_USERS: {
      HEADER_TITLE: 'Banned users',
    },
    OPEN_CHANNEL_MUTED_PARTICIPANTS: {
      HEADER_TITLE: 'Muted participants',
    },
    OPEN_CHANNEL_OPERATORS: {
      HEADER_TITLE: 'Operators',
    },
    OPEN_CHANNEL_REGISTER_OPERATOR: {
      HEADER_TITLE: 'Set as operators',
      HEADER_RIGHT: number => `Add (${number})`,
    },
    LABELS: {
      USER_NO_NAME: '(No name)',
      TYPING_INDICATOR_TYPINGS: users =>
        users.length === 0
          ? ''
          : users.length === 1
          ? `${users[0]} is typing...`
          : users.length === 2
          ? `${users[0]} and ${users[1]} are typing...`
          : 'Several people are typing...',
      REGISTER_AS_OPERATOR: 'Register as operator',
      UNREGISTER_OPERATOR: 'Unregister operator',
      MUTE: 'Mute',
      UNMUTE: 'Unmute',
      BAN: 'Ban',
      UNBAN: 'Unban',
      CHANNEL_INPUT_PLACEHOLDER_ACTIVE: 'Enter message',
      CHANNEL_INPUT_PLACEHOLDER_DISABLED: 'Chat not available in this channel.',
      CHANNEL_INPUT_PLACEHOLDER_MUTED: "You're muted by the operator.",
      CHANNEL_INPUT_EDIT_OK: 'Save',
      CHANNEL_INPUT_EDIT_CANCEL: 'Cancel',
      CHANNEL_INPUT_ATTACHMENT_CAMERA_PHOTO: 'Take a photo',
      CHANNEL_INPUT_ATTACHMENT_CAMERA_VIDEO: 'Take a video',
      CHANNEL_INPUT_ATTACHMENT_PHOTO_LIBRARY: 'Photo library',
      CHANNEL_INPUT_ATTACHMENT_FILES: 'Files',
      CHANNEL_MESSAGE_COPY: 'Copy',
      CHANNEL_MESSAGE_EDIT: 'Edit',
      CHANNEL_MESSAGE_SAVE: 'Save',
      CHANNEL_MESSAGE_DELETE: 'Delete',
      CHANNEL_MESSAGE_DELETE_CONFIRM_TITLE: 'Delete this message?',
      CHANNEL_MESSAGE_DELETE_CONFIRM_OK: 'Delete',
      CHANNEL_MESSAGE_DELETE_CONFIRM_CANCEL: 'Cancel',
      CHANNEL_MESSAGE_RETRY: 'Retry',
      CHANNEL_MESSAGE_REMOVE: 'Remove',
      CHANNEL_MESSAGE_FAILED_RETRY: 'Retry',
      CHANNEL_MESSAGE_FAILED_REMOVE: 'Remove',
      CHANNEL_MESSAGE_LIST_FROZEN: 'Channel is frozen',
      USER_BAR_ME_POSTFIX: '(You)',
      USER_BAR_OPERATOR: 'Operator',
    },
    PLACEHOLDER: {
      NO_CHANNELS: 'No channels',
      NO_MESSAGES: 'No messages',
      NO_MUTED_MEMBERS: 'No muted members',
      NO_BANNED_USERS: 'No banned users',
      NO_RESULTS_FOUND: 'No results found',
      ERROR: {
        MESSAGE: 'Something went wrong',
        RETRY_LABEL: 'Retry',
      },
      NO_MUTED_PARTICIPANTS: 'No muted participants',
    },
    DIALOG: {
      ALERT_DEFAULT_OK: 'Ok',
      PROMPT_DEFAULT_OK: 'Submit',
      PROMPT_DEFAULT_CANCEL: 'Cancel',
      PROMPT_DEFAULT_PLACEHOLDER: 'Enter',
    },
    TOAST: {
      COPY_OK: 'Copied',
      DOWNLOAD_START: 'Downloading...',
      DOWNLOAD_OK: 'File saved',
      DOWNLOAD_ERROR: "Couldn't download file.",
      OPEN_CAMERA_ERROR: "Couldn't open camera.",
      OPEN_FILES_ERROR: "Couldn't open files.",
      OPEN_PHOTO_LIBRARY_ERROR: "Couldn't open photo library.",
      DELETE_MSG_ERROR: "Couldn't delete message.",
      RESEND_MSG_ERROR: "Couldn't send message.",
      SEND_MSG_ERROR: "Couldn't send message.",
      UPDATE_MSG_ERROR: "Couldn't edit message.",
      TURN_ON_NOTIFICATIONS_ERROR: "Couldn't turn on notifications.",
      TURN_OFF_NOTIFICATIONS_ERROR: "Couldn't turn off notifications.",
      LEAVE_CHANEL_ERROR: "Couldn't leave channel.",
      UNKNOWN_ERROR: 'Something went wrong.',
      GET_CHANNEL_ERROR: "Couldn't retrieve channel.",
    },
  },
});

export default defaultLocale;

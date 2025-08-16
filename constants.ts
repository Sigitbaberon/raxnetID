import React from 'react';
import { ActionType } from './types';
import { LikeIcon, CommentIcon, ShareIcon, FollowIcon, SubscribeIcon } from './components/icons';

export const GOOGLE_OAUTH_CLIENT_ID = '836300857508-2hnaghtkoa2rqg8qregdtuk0vhc4vf6n.apps.googleusercontent.com';
export const GOOGLE_OAUTH_REDIRECT_URI = 'https://sosial.raxnet.my.id/login-callback';

export const ACTION_TYPE_CONFIG: Record<ActionType, { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
    [ActionType.LIKE]: { label: 'Like', icon: LikeIcon },
    [ActionType.COMMENT]: { label: 'Comment', icon: CommentIcon },
    [ActionType.SHARE]: { label: 'Share', icon: ShareIcon },
    [ActionType.FOLLOW]: { label: 'Follow', icon: FollowIcon },
    [ActionType.SUBSCRIBE]: { label: 'Subscribe', icon: SubscribeIcon },
};

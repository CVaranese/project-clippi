import * as React from "react";

import { ActionTypeGenerator } from "@vinceau/event-actions";
import { Form, Icon, TextArea } from "semantic-ui-react";

import { notify } from "@/lib/utils";
import { ActionComponent } from "./types";

const MAX_SNIPPET_LENGTH = 30;

interface ActionNotifyParams {
    message: string;
    title?: string;
}

const ActionNotifyFunc: ActionTypeGenerator = (params: ActionNotifyParams) => {
    return async (): Promise<void> => {
        notify(params.message, params.title);
    };
};

const Snippet: React.FC<{value: ActionNotifyParams}> = props => {
    const message = props.value.message ? props.value.message : "";
    return <div>notify <b>{message.substr(0, MAX_SNIPPET_LENGTH)}...</b></div>;
};

const ActionIcon = () => {
    return (
        <Icon name="exclamation circle" size="large" />
    );
};

const NotifyInput = (props: any) => {
    const { value, onChange } = props;
    const defaultValue = value && value.message ? value.message : "";
    const [ msg, setMsg ] = React.useState(defaultValue);
    return (
        <div style={{maxWidth: "500px"}}>
            <Form>
                <TextArea
                    onBlur={() => onChange(({ message: msg }))}
                    value={msg}
                    onChange={(_: any, {value}: any) => setMsg(value)}
                    placeholder="Here's a notification!"
                />
            </Form>
        </div>
    );
};

export const ActionNotify: ActionComponent = {
    label: "show a notification",
    action: ActionNotifyFunc,
    Snippet,
    Icon: ActionIcon,
    Component: NotifyInput,
};

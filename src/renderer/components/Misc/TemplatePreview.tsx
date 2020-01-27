import * as React from "react";

import { generateFileRenameContext, parseFileRenameFormat } from "@/lib/context";
import { contextDescriptions } from "@/lib/contextDescriptions";
import { Context } from "@vinceau/event-actions";
import { GameStartType } from "@vinceau/slp-realtime";
import { Tooltip } from "react-tippy";
import { Label } from "semantic-ui-react";

export const TemplatePreview: React.FC<{
    template: string;
    settings?: GameStartType,
    metadata?: any,
}> = (props) => {
    const parsedTemplate = parseFileRenameFormat(props.template, props.settings, props.metadata);
    return (
    <span>{parsedTemplate}</span>
    );
};

export const ContextOptions: React.FC<{
    onLabelClick?: (name: string) => void;
    context?: Context
}> = props => {
    const context = props.context ? props.context : generateFileRenameContext();
    const allDescriptions = contextDescriptions;
    const keys = Object.keys(context);
    const clickHandler = (name: string) => {
        if (props.onLabelClick) {
            props.onLabelClick(name);
        }
    };
    const usedDescriptions = allDescriptions.filter(cat => cat.descriptions.map(d => d.contextName).some(x => keys.includes(x)));
    const descriptions = usedDescriptions.map(cat => (
        <div key={cat.category}>
        <b style={{marginRight: "5px"}}>{cat.category}</b>
        {cat.descriptions.filter(d => keys.includes(d.contextName)).map(d => (
            <Tooltip
                key={`${cat.category}--${d.contextName}`}
                title={d.description}
                arrow={true}
                duration={200}
                position="top"
                style={{ display: "inline-block" }}
            >
                <Label as="a" onClick={() => clickHandler(d.contextName)} style={{margin: "2px"}}>{d.contextName}</Label>
            </Tooltip>
        ))}
        </div>
    ));
    return (
        <div style={{padding: "5px 0"}}>
        {descriptions}
        </div>
    );
};

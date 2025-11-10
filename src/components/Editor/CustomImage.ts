import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: element => element.getAttribute("src"),
                renderHTML: attributes => {
                    if (!attributes.src) return {};
                    return { src: attributes.src };
                },
            },
            width: {
                default: null,
                parseHTML: element => element.getAttribute("width"),
                renderHTML: attributes => attributes.width ? { width: attributes.width } : {},
            },
            height: {
                default: null,
                parseHTML: element => element.getAttribute("height"),
                renderHTML: attributes => attributes.height ? { height: attributes.height } : {},
            },
            style: {
                default: null,
                parseHTML: element => {
                    const style = element.getAttribute("style") || "";
                    const container = element.getAttribute("containerstyle") || "";
                    const wrapper = element.getAttribute("wrapperstyle") || "";
                    return [style, container, wrapper].filter(Boolean).join("; ");
                },
                renderHTML: attributes => attributes.style ? { style: attributes.style } : {},
            },
            class: {
                default: null,
                parseHTML: el => el.getAttribute("class"),
                renderHTML: attrs => attrs.class ? { class: attrs.class } : {},
            },
        };
    },
});

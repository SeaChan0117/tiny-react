export default function unmountNode(node) {
    const virtualDOM = node._virtualDOM
    // 文本节点可以直接删除
    if (virtualDOM.type === 'text') {
        node.remove()
        return
    }
    // 看一下节点是否是由组件生成的
    let component = virtualDOM.component
    // 如果 component 存在，就说明节点是由组件生成的
    if (component) {
        component.componentWillUnmount()
    }
    // 看一下节点身上是否有 ref 属性
    if (virtualDOM.props && virtualDOM.props.ref) {
        virtualDOM.props.ref(null)
    }
    // 看一下节点的属性中是否有事件属性
    Object.keys(virtualDOM.props).forEach(propName => {
        if (propName.startsWith('on')) {
            const eventName = propName.toLowerCase().slice(0, 2)
            const eventHandler = virtualDOM.props[propName]
            node.removeEventListener(eventName, eventHandler)
        }
    })
    // 递归删除子节点
    if (node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
            unmountNode(node.childNodes[i])
            i--
        }
    }

    node.remove()
}

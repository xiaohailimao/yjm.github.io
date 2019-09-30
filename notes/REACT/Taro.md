# taro组件构子
```ts
componentWillMount?(): void;
componentDidMount?(): void;
componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, prevContext: any): void;
componentWillUnmount?(): void;
componentWillPreload?(params: {[propName: string]: any}): any;
componentDidShow?(): void;
componentDidHide?(): void;
componentDidCatchError?(err: string): void;
componentDidNotFound?(obj: PageNotFoundObject): void;
onPullDownRefresh?(): void;
onReachBottom?(): void;
onPageScroll?(obj: PageScrollObject): void;
onShareAppMessage?(obj: ShareAppMessageObject): ShareAppMessageReturn;
onTabItemTap?(obj: TabItemTapObject): void;
onResize?(): void
```

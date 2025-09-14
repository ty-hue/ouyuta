
export interface TabBarListState{
    tabBarList:TabBarItem[],
    currentIndex:number
}

interface TabBarItem{
    text:string
    iconClassName:string
    path:string,
    num:number,
    id:number
}
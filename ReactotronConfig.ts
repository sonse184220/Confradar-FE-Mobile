// ReactotronConfig.ts
import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

declare global {
    interface Console {
        tron: typeof Reactotron
    }
}

// Reactotron
//     .configure({ name: 'Confradar' })
//     .useReactNative(
//         {
//             networking: { ignoreUrls: /symbolicate/ },
//             editor: false,
//             overlay: false
//         }
//     )
//     .use(reactotronRedux())
//     .connect()

// console.tron = Reactotron

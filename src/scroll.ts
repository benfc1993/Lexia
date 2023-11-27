import { startScroll } from './scroll/parse'
import { storage } from './storage/sync'

startScroll(storage())

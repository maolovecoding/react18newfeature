import { ChangeEvent, startTransition, useEffect, useState, useDeferredValue } from 'react';

// 搜索的联想，要先响应用户输入框，更新输入框，然后更新联想搜索区域的内容
// 输入很快的时候 打断联想的更新，先响应输入框更新

export default function () {
  const [keyword, setKeyword] = useState('')
  let deferredText = useDeferredValue(keyword)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  return (
    <div>
      关键字 <input value={keyword} onChange={handleChange} />
      <Suggestions keyword={ deferredText } />
    </div>
  )
}

function Suggestions(props: { keyword: string; }) {
  const [words, setWords] = useState<string[]>([])
  useEffect(() => {
    getWords(props.keyword).then(words => {
      setWords(words)
    })
  }, [props.keyword])
  return (
    <ul>
      {
        words.map(val => <li key={val}>{ val }</li>)
      }
    </ul>
  )
}

function getWords(keyword: string) {
  let words = new Array(5000).fill(0).map((item:number, index:number) => keyword+index)
  return new Promise<string[]>((resolve, reject) => {
    resolve(words)
  })
}
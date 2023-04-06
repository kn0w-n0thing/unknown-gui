import React, {FC} from 'react';
import parser from 'html-react-parser';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Console.css'

interface Props {content: string}

export const Console: FC<Props> = ({content}) => {
  return <ScrollToBottom className="Console">
    {parser(content)}
  </ScrollToBottom>
}
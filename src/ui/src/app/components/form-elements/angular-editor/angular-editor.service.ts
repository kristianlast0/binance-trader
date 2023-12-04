import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {CustomClass} from './config';
import { TableSelectOption } from './ae-table-select/ae-table-select.component';

export interface UploadResponse {
  imageUrl: string;
}

@Injectable()
export class AngularEditorService {

  savedSelection!: Range | null;
  selectedText!: string;
  uploadUrl!: string;
  uploadWithCredentials!: boolean;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private doc: any
  ) { }

  /**
   * Executed command from editor header buttons exclude toggleEditorMode
   * @param command string from triggerCommand
   * @param value
   */
  executeCommand(command: string, value?: string) {
    console.log('%c service', 'background: #222; color: #bada55');
    console.log('executeCommand', command, value);
    const commands = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'];
    if (commands.includes(command)) {
      this.doc.execCommand('formatBlock', false, command);
      return;
    }
    this.doc.execCommand(command, false, value);
  }

  /**
   * Create URL link
   * @param url string from UI prompt
   */
  createLink(url: string) {
    if (!url.includes('http')) {
      this.doc.execCommand('createlink', false, url);
    } else {
      const newUrl = '<a href="' + url + '" target="_blank">' + this.selectedText + '</a>';
      this.insertHtml(newUrl);
    }
  }

  /**
   * insert color either font or background
   *
   * @param color color to be inserted
   * @param where where the color has to be inserted either text/background
   */
  insertColor(color: string, where: string): void {
    const restored = this.restoreSelection();
    if (restored) {
      if (where === 'textColor') {
        this.doc.execCommand('foreColor', false, color);
      } else {
        this.doc.execCommand('hiliteColor', false, color);
      }
    }
  }

  /**
   * Set font name
   * @param fontName string
   */
  setFontName(fontName: string) {
    this.doc.execCommand('fontName', false, fontName);
  }

  /**
   * Set font size
   * @param fontSize string
   */
  setFontSize(fontSize: string) {
    this.doc.execCommand('fontSize', false, fontSize);
  }

  /**
   * Create raw HTML
   * @param html HTML string
   */
  insertHtml(html: string): void {

    const isHTMLInserted = this.doc.execCommand('insertHTML', false, html);

    if (!isHTMLInserted) {
      throw new Error('Unable to perform the operation');
    }
  }

  /**
   * Insert HTML table
   * @param rows number
   * @param columns number
   * @param padding padding string
   * @param spacing spacing string
   * @param border border string
   */
  insertTable(size: TableSelectOption): void {

    this.restoreSelection();

    let rows = size && size.row ? (size.row+1) : null;
    let columns = size && size.col ? (size.col+1) : null;

    if(rows === null) rows = parseInt(prompt("Enter number of rows:", "2") ?? "2");
    if(columns === null) columns = parseInt(prompt("Enter number of columns:", "2") ?? "2");

    const padding = prompt("Enter padding (e.g., '10px'):", "10px");
    const spacing = prompt("Enter spacing (e.g., '5px'):", "0px");
    const border = prompt("Enter border (e.g., '1px solid green'):", "1px solid #f2f2f2");
  
    if(rows > 0 && columns > 0) {
      const table = [`<table style="width: 100%; border-collapse: collapse; border-spacing: ${spacing};">`];
      for (let i = 0; i < rows; i++) {
        table.push('<tr>');
        for (let j = 0; j < columns; j++) {
          table.push(`<td style="padding: ${padding}; border: ${border};">&nbsp;</td>`);
        }
        table.push('</tr>');
      }
      table.push('</table>');
      const html = table.join('');
      this.doc.execCommand('insertHTML', false, html);
    }
  }
  

  /**
   * save selection when the editor is focussed out
   */
  public saveSelection = (): void => {
    if (this.doc.getSelection) {
      const sel = this.doc.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        this.savedSelection = sel.getRangeAt(0);
        this.selectedText = sel.toString();
      }
    } else if (this.doc.getSelection && this.doc.createRange) {
      this.savedSelection = document.createRange();
    } else {
      this.savedSelection = null;
    }
  }

  /**
   * restore selection when the editor is focused in
   *
   * saved selection when the editor is focused out
   */
  restoreSelection(): boolean {
    if (this.savedSelection) {
      if (this.doc.getSelection) {
        const sel = this.doc.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.savedSelection);
        return true;
      } else if (this.doc.getSelection /*&& this.savedSelection.select*/) {
        // this.savedSelection.select();
        return true;
      }
    }
    return false;
  }

  /**
   * setTimeout used for execute 'saveSelection' method in next event loop iteration
   */
  public executeInNextQueueIteration(callbackFn: (...args: any[]) => any, timeout = 1e2): void {
    setTimeout(callbackFn, timeout);
  }

  /** check any selection is made or not */
  private checkSelection(): any {
    const selectedText = this.savedSelection!.toString() ?? "";
    if (selectedText.length === 0) throw new Error('No Selection Made');
    return true;
  }

  /**
   * Upload file to uploadUrl
   * @param file The file
   */
  uploadImage(file: File): Observable<HttpEvent<UploadResponse>> {

    const uploadData: FormData = new FormData();

    uploadData.append('file', file, file.name);

    return this.http.post<UploadResponse>(this.uploadUrl, uploadData, {
      reportProgress: true,
      observe: 'events',
      withCredentials: this.uploadWithCredentials,
    });
  }

  /**
   * Insert image with Url
   * @param imageUrl The imageUrl.
   */
  insertImage(imageUrl: string) {
    this.doc.execCommand('insertImage', false, imageUrl);
  }

  setDefaultParagraphSeparator(separator: string) {
    this.doc.execCommand('defaultParagraphSeparator', false, separator);
  }

  createCustomClass(customClass: CustomClass) {
    let newTag = this.selectedText;
    if (customClass) {
      const tagName = customClass.tag ? customClass.tag : 'span';
      newTag = '<' + tagName + ' class="' + customClass.class + '">' + this.selectedText + '</' + tagName + '>';
    }
    this.insertHtml(newTag);
  }

  insertVideo(videoUrl: string) {
    if (videoUrl.match('www.youtube.com')) {
      this.insertYouTubeVideoTag(videoUrl);
    }
    if (videoUrl.match('vimeo.com')) {
      this.insertVimeoVideoTag(videoUrl);
    }
  }

  private insertYouTubeVideoTag(videoUrl: string): void {
    const id = videoUrl.split('v=')[1];
    const imageUrl = `https://img.youtube.com/vi/${id}/0.jpg`;
    const thumbnail = `
      <div style='position: relative'>
        <a href='${videoUrl}' target='_blank'>
          <img src="${imageUrl}" alt="click to watch"/>
          <img style='position: absolute; left:200px; top:140px'
          src="https://img.icons8.com/color/96/000000/youtube-play.png"/>
        </a>
      </div>`;
    this.insertHtml(thumbnail);
  }

  private insertVimeoVideoTag(videoUrl: string): void {
    const sub = this.http.get<any>(`https://vimeo.com/api/oembed.json?url=${videoUrl}`).subscribe(data => {
      const imageUrl = data.thumbnail_url_with_play_button;
      const thumbnail = `<div>
        <a href='${videoUrl}' target='_blank'>
          <img src="${imageUrl}" alt="${data.title}"/>
        </a>
      </div>`;
      this.insertHtml(thumbnail);
      sub.unsubscribe();
    });
  }

  nextNode(node: Node): Node | null {
    if (node.hasChildNodes()) {
      return node.firstChild;
    } else {
      while (node && !node.nextSibling) {
        node = node.parentNode as Node;
      }
      if (!node) {
        return null;
      }
      return node.nextSibling;
    }
  }

  getRangeSelectedNodes(range: Range, includePartiallySelectedContainers: boolean): Node[] {
    let node: Node | null = range.startContainer;
    const endNode: Node = range.endContainer;
    let rangeNodes: Node[] = [];

    // Special case for a range that is contained within a single node
    if (node === endNode) {
      rangeNodes = [node];
    } else {
      // Iterate nodes until we hit the end container
      while (node && node !== endNode) {
        const nextNode = this.nextNode(node);
        if (nextNode) {
            node = nextNode;
            rangeNodes.push(node);
        } else {
            break;
        }
      }

      // Add partially selected nodes at the start of the range
      node = range.startContainer;
      while (node && node !== range.commonAncestorContainer) {
        rangeNodes.unshift(node);
        node = node.parentNode;
      }
    }

    // Add ancestors of the range container, if required
    if (includePartiallySelectedContainers) {
      node = range.commonAncestorContainer;
      while (node) {
        rangeNodes.push(node);
        node = node.parentNode;
      }
    }

    return rangeNodes;
  }

  getSelectedNodes() {
    const nodes: Node[] = [];
    if (this.doc.getSelection) {
      const sel = this.doc.getSelection();
      for (let i = 0, len = sel.rangeCount; i < len; ++i) {
        nodes.push.apply(nodes, this.getRangeSelectedNodes(sel.getRangeAt(i), true));
      }
    }
    return nodes;
  }

  replaceWithOwnChildren(el: Node): void {
    const parent: Node | null = el.parentNode;
    if (parent) {
      while (el.hasChildNodes()) {
        parent.insertBefore(el.firstChild as Node, el);
      }
      parent.removeChild(el);
    }
  }

  removeSelectedElements(tagNames: string) {
    const tagNamesArray = tagNames.toLowerCase().split(',');
    this.getSelectedNodes().forEach((node) => {
      if (node.nodeType === 1 && node instanceof Element && tagNamesArray.indexOf(node.tagName.toLowerCase()) > -1) {
        // Remove the node and replace it with its children
        this.replaceWithOwnChildren(node);
      }
    });
  }
}

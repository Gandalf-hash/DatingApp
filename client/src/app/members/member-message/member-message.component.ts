import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/messages';
import { MessageService } from 'src/app/_service/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.css']
})
export class MemberMessageComponent {
  @ViewChild('messageForm') messageForm?: NgForm
  @Input() username?: string;
  @Input() messages: Message[] = [];
  messageContent = '';

  constructor(public messageService: MessageService) {}

  ngOnInit(): void {
    
  }

  sendMessage() {
    if (!this.username) return;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    })
  }
  

}

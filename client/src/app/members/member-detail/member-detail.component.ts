import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryModule, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
// import { NgxGalleryAnimation } from '@kolkov/ngx-gallery/public-api';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/messages';
import { MessageService } from 'src/app/_service/message.service';
import { MembersService } from 'src/app/_services/members.service';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
  
export class MemberDetailComponent {
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  galleryOptions: NgxGalleryModule [] = [];
  galleryImages: NgxGalleryModule[] = [];
  activeTab?  : TabDirective;
  messages: Message[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute, private massageService: MessageService) { }

  ngOnInit() : void {
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
    this.galleryImages = this.getImages();
    
  }

  getImages() {
    if (!this.member) return [];
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }
    return imageUrls;
  }


  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true}
   }
   
  

  loadMessages() {
    if (this.member) {
      this.massageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading == 'Messages') {
      this.loadMessages();
    }
  }
}

---
title: Switching from LXDE to LXQT in Lubuntu 14.10 Utopic Unicorn
description: Switching from LXDE to LXQT in Lubuntu 14.10 Utopic Unicorn Hey! So if you're like me, you've been dying to try out the new LXQT Desktop Environment everyone has been talking so much about! But so far, a official release of Lubuntu with LXQT has not been developed. There is an u…
summary: Switching from LXDE to LXQT in Lubuntu 14.10 Utopic Unicorn Hey! So if you're like me, you've been dying to try out the new LXQT Desktop Environment everyone has been talking so much about! But so far, a official release of Lubuntu with LXQT has not been developed. There is an u…
date: 2015-01-13T19:11:00Z
author: Avery Freeman
slug: switching-from-lxde-to-lxqt-in-lubuntu-14-10-utopic-unicorn
categories:
  - Random
thumbnail: http://3.bp.blogspot.com/-BMZGEybcumI/VLVtxwpTjfI/AAAAAAAAD4I/pr1e3HrJqNk/s1600/2015-01-13-111050_2560x1024_scrot.png
thumbnail_alt: Switching from LXDE to LXQT in Lubuntu 14.10 Utopic Unicorn
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2015/01/switching-from-lxde-to-lxqt-in-lubuntu-14-10-utopic-unicorn/
---

<!-- Imported from WordPress post 34. -->

[![](http://3.bp.blogspot.com/-BMZGEybcumI/VLVtxwpTjfI/AAAAAAAAD4I/pr1e3HrJqNk/s1600/2015-01-13-111050_2560x1024_scrot.png)](http://3.bp.blogspot.com/-BMZGEybcumI/VLVtxwpTjfI/AAAAAAAAD4I/pr1e3HrJqNk/s1600/2015-01-13-111050_2560x1024_scrot.png)

  

## Switching from LXDE to LXQT in Lubuntu 14.10 Utopic Unicorn

  

### Hey!

###   

So if you're like me, you've been dying to try out the new LXQT Desktop Environment everyone has been talking so much about!  
  
But so far, a official release of Lubuntu with LXQT has not been developed.   There is an unofficial release, but it does not have an installer package AFAIK.  
What to do?  
  

#### The current approach is, of course, to manually switch from LXDE to LXQT after installing a base version of Lubuntu 14.10 --- Here's how it goes:

  
1) Install a fresh copy of Lubuntu 14.10 from the official repository, which is here:  
  
[http://lubuntu.net/blog/lubuntu-1410-utopic-unicorn-released](http://lubuntu.net/blog/lubuntu-1410-utopic-unicorn-released)  
  
  
2) After installing the copy, get ready to convert your Desktop Environment to LXQT.  
  
Go to the command prompt by hitting ALT-F2 on the desktop and typing LXTerminal.  Then, once the terminal window is open, type the following:  
  
$ sudo apt-get update && sudo apt-get upgrade  
  
  
Type in your password, and you're good to go!  
  
Then, to do the actual switch, invoke this command at the prompt:  
  
$ sudo add-apt-repository ppa:lubuntu-dev/lubuntu-daily  
  
  
Then,  
  
$ sudo apt-get update  
  
  
Finally,  
  
  
$ sudo aptitude install lxqt-metapackage lxqt-session lxsession  
  
  
Note the use of aptitude in the above step, because apt-get has the tendency to complain about doing this ... (try it, you'll see!)   
  

###   
  
However, you should be warned that this approach causes a few issues with your setup.  In the terminal you'll see the this: 

  
The following actions will resolve these dependencies:  
  
      Remove the following packages:                                                               
1)      gnome-system-tools                                                                         
2)      gnome-time-admin                                                                           
3)      lubuntu-desktop                                                                            
4)      network-manager-gnome                                                                      
5)      ubuntu-release-upgrader-gtk                                                                
6)      update-manager                                                                             
7)      update-notifier                                                                            
  
      Leave the following dependencies unresolved:                                                 
8)      apport-gtk recommends update-notifier                                                      
9)      gvfs-daemons recommends policykit-1-gnome                                                  
10)     network-manager recommends network-manager-gnome | plasma-widget-networkmanagement   
  
  
Well, we're not going to let a little thing like bro  
  

### As far as I can tell, these are the most pressing issues to resolve:

  
1) The logout menu is broken:  
  
It removes the lxsession-logout package, which makes it difficult to log out of the DE when you used to be able to just hit "logout" from the panel and have it bring up the menu.  
  
To fix this, at the command prompt, invoke:  
  
$ sudo apt-get install lxsession-logout  
  
  
2) The network manager is no longer present:  
  
The switch has also removed your network manager by default, so to get it back, invoke:  
  
$ sudo apt-get install network-manager  
  
  
3) System tools have been uninstalled:  
  
Want the system tools you're used to seeing back?  It's easy enough, just invoke:  
  
$ sudo apt-get install gnome-system-tools  
  
4) Wait!  What about the lubuntu-lxpanel-icons package I see being uninstalled??  
  
The panel in LXQT is actually LXQT-Panel, so it is different, so not to worry -- it uses it's own set of icons, so you don't need the lubuntu-lxpanel-icons package any more!  
  
  
  
Well, that about wraps it up!  Do you have any questions or comments about this process?  See anything I did wrong, or want to mention anything else that this switch will impair/remove/destroy?   Please reply in the comments section!  Thanks!

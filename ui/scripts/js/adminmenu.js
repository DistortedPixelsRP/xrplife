///////////////////////////////////////////////////////////////////////////
// Vue app handling admin menu instance
///////////////////////////////////////////////////////////////////////////
const AdminMenu = new Vue({
    el: "#Admin_Menu",

    data: {
        
        // Important Data
        resource_name: "xrplife",
        name: "",
        rank: "",

        // Booleans
        showMenu: false,
        showError: false,
        muteChatNotification: false,
        loading: false,

        // Strings
        errorMessage: "",
        currentPage: "main", // main
        adminMessage: "",
        
        // Arrays
        playerPerms: [],
        players: [],
        pages: [
            {label: "Main", page: "main", perm: false},
            {label: "Chat", page: "chat", perm: "Chat"},
            {label: "Reports", page: "reports", perm: "Report"},
            {label: "kicking", page: "kick", perm: "Kick"},
            {label: "Banning", page: "ban", perm: "Ban"},
            {label: "Whitelisting", page: "white", perm: "Whitelisting"},
            {label: "Change Ranks", page: "ranks", perm: "ChangeRanks"}
        ],
        AdminMessages: [],
        BanTimeTypes: ["Seconds", "Minutes", "Hours", "Days", "Weeks", "Months", "Years"],

        // Rules
        banTimeRules: [
            (v) => !!v || "Time required",
            (v) => typeof v != "int" || "Number Required",
            (v) => v > 0 || "Number must be greater than 0"
        ],

        // Kicking Player
        ChosenPlayerKick: {},
        ChosenKickReason: "",

        // Banning Player
        BanFormValid: "",
        ChosenPlayerBan: {},
        ChosenBanReason: "",
        BanTimeType: "Seconds",
        IsBanPerm: false,
        ChosenBanTime: ""

        // Whitelisting Player


    },

    methods: {

        // Menu Methods
        OpenMenu(name, rank, perms, players) {
            this.name = name;
            this.rank = rank;
            this.playerPerms = perms;
            this.players = players;
            this.showMenu = true;
        },

        CloseMenu() {
            this.showMenu = false;
            this.showError = false;
            axios.post("http://" + this.resource_name + "/closeadmin", {
            }).then( (response) => {
                console.log(response);
            }).catch( (error) => {
                console.log(error);
            })
        },

        ChangePage(page, perm) {
            if (this.CheckPerm(perm)) {
                this.currentPage = page;
            } else {
                this.ThrowError("You do not have permission to view that page.");
            }
        },

        CheckPerm(perm) {
            if (perm != false) {
                for (a = 0; a < this.playerPerms.length; a++) {
                    if (this.playerPerms[a] == perm) {
                        return true;
                    }
                }
            } else {
                return true
            }
            return false
        },


        // Chat Methods
        ToggleChatNotifications() {
            this.muteChatNotification = !this.muteChatNotification;
        },

        SendChatMessage() {
            if (this.adminMessage.length >= 1) {
                if (this.AdminMessages.length >= 30) {
                    this.AdminMessages.splice(0, 1);
                }

                this.AdminMessages.push({rank: this.rank, name: this.name, message: this.adminMessage});
                
                axios.post("http://" + this.resource_name + "/sendadminmessage", {
                    message: {rank: this.rank, name: this.name, message: this.adminMessage}
                }).then( (response) => {
                    console.log(response);
                }).catch( (error) => {
                    console.log(error);
                })
                this.adminMessage = "";
            }
        },

        RecieveChatMessage(message_data, perms) {
            this.playerPerms = perms

            if (this.AdminMessages.length >= 30) {
                this.AdminMessages.splice(0, 1);
            }

            this.AdminMessages.push(message_data);

            if (this.CheckPerm("Chat")) {
                if (this.muteChatNotification == false) {
                    var notif = new Audio("././sounds/admin_chat_notification.ogg");
                    notif.play();
                }
            }
        },

        // Kick Methods
        SetSelectedKickPlayer(_index) {
            this.ChosenPlayerKick = this.players[_index];
        },

        SetKickPlayer() {
            if (this.ChosenPlayerKick.serverid != null) {
                axios.post("http://" + this.resource_name + "/recievekickrequest", {
                    player: this.ChosenPlayerKick.serverid,
                    reason: this.ChosenKickReason
                }).then( (response) => {
                    console.log(response);
                }).catch( (error) => {
                    console.log(error);
                })
            } else {
                this.ThrowError("No player selected");
            }
        },

        ClearKickMenu() {
            this.ChosenPlayerKick = {};
            this.ChosenKickReason = "";
        },

        // Ban Methods
        SetSelectedBanPlayer(_index) {
            this.ChosenPlayerBan = this.players[_index];
        },

        SetBanPlayer() {
            if (this.ChosenPlayerBan.serverid != null) {
                if (this.$refs.banForm.validate()) {
                    var convertedSeconds = 0;

                    if (!this.IsBanPerm) {
                        if (this.BanTimeType == "Seconds") {
                            convertedSeconds = Number(this.ChosenBanTime);
                        } else if (this.BanTimeType == "Minutes") {
                            convertedSeconds = Number(this.ChosenBanTime) * 60;
                        } else if (this.BanTimeType == "Hours") {
                            convertedSeconds = Number(this.ChosenBanTime) * 3600;
                        } else if (this.BanTimeType == "Days") {
                            convertedSeconds = Number(this.ChosenBanTime) * 86400;
                        } else if (this.BanTimeType == "Weeks") {
                            convertedSeconds = Number(this.ChosenBanTime) * 604800;
                        } else if (this.BanTimeType == "Months") {
                            convertedSeconds = Number(this.ChosenBanTime) * 2628000;
                        } else if (this.BanTimeType == "Years") {
                            convertedSeconds = Number(this.ChosenBanTime) * 31536000;
                        } else {
                            convertedSeconds = Number(this.ChosenBanTime);
                        }
                    } else {
                        convertedSeconds = -1;
                    }

                    axios.post("http://" + this.resource_name + "/recievebanrequest", {
                        player: this.ChosenPlayerBan.serverid,
                        reason: this.ChosenBanReason,
                        time: convertedSeconds
                    }).then( (response) => {
                        console.log(response);
                    }).catch( (error) => {
                        console.log(error);
                    })
                }
            } else {
                this.ThrowError("No player selected");
            }
        },

        ClearBanMenu() {
            this.ChosenPlayerBan = {};
            this.ChosenBanReason = "";
            this.IsBanPerm = false;
            this.ChosenBanTime = "";
            this.$refs.banForm.reset();
            this.BanTimeType = "Seconds";
        },

        // Error Method
        ThrowError(Message) {
            this.errorMessage = Message;
            this.showError = true;
        },
    },

    watch: {

        "ChosenBanTime" : (val, oldVal) => {
            if (val != oldVal) {
                var round = Math.round(val);
                AdminMenu.ChosenBanTime = round;
            }
        }

    }
})
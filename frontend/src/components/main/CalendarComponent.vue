<template>
    <div class="container-fluid">
        <div class="row">

            <div class="col-md-12">
                <h2>Calendar <a href="#" class="btn btn-link text-decoration-none" data-bs-toggle="modal"
                        data-bs-target="#settings-modal"><i class="bi bi-gear" style="font-size: 1.25em;"></i></a></h2>
                <div class="accordion" id="settingsAccordion">

                </div>
                <div class="calendar-parent">
                    <calendar-view :items="items" :show-date="showDate"
                        :time-format-options="{ hour: 'numeric', minute: '2-digit' }" :enable-drag-drop="true"
                        :disable-past="disablePast" :disable-future="disableFuture" :show-times="showTimes"
                        :date-classes="myDateClasses" :display-period-uom="displayPeriodUom"
                        :display-period-count="displayPeriodCount" :starting-day-of-week="startingDayOfWeek"
                        :class="themeClasses" :period-changed-callback="periodChanged"
                        :current-period-label="useTodayIcons ? 'icons' : ''" :displayWeekNumbers="displayWeekNumbers"
                        :enable-date-selection="true" :selection-start="selectionStart" :selection-end="selectionEnd"
                        @date-selection-start="setSelection" @date-selection="setSelection"
                        @date-selection-finish="finishSelection" @drop-on-date="onDrop" @click-date="onClickDay"
                        @click-item="onClickItem">
                        <template #header="{ headerProps }">
                            <calendar-view-header slot="header" :header-props="headerProps" @input="setShowDate" />
                        </template>
                    </calendar-view>
                </div>
            </div>
        </div>
        <!-- Modals -->

        <div class="modal fade" id="BookDayModal" tabindex="-1" role="dialog" aria-labelledby="BookDayModalLabel">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="BookDayModalLabel">Reservation Info</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">

                        <form>
                            <!-- Client Information -->
                            <h4>Client Info</h4>
                            <div class="form-group row">
                                <label for="name" class="col-sm-2 col-form-label">Name:</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control" id="name" v-model="reservation.clientName" required>
                                </div>
                                <label for="email" class="col-sm-2 col-form-label">Email:</label>
                                <div class="col-sm-4">
                                    <input type="email" class="form-control" id="email" v-model="reservation.clientEmail" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="address" class="col-sm-2 col-form-label">Address:</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control" id="address" v-model="reservation.clientAddress" required>
                                </div>
                                <label for="phone" class="col-sm-2 col-form-label">Phone:</label>
                                <div class="col-sm-4">
                                    <input type="tel" class="form-control" id="phone" v-model="reservation.clientPhone" required>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="nationality" class="col-sm-2 col-form-label">Nationality:</label>
                                <div class="col-sm-4">
                                    <select class="form-control" id="nationality" v-model="reservation.clientNationality" required>
                                        <option value="">-- Please select --</option>
                                        <option value="Filipino">Filipino</option>
                                        <option value="Foreign">Foreign</option>
                                    </select>
                                </div>
                                <label for="clientType" class="col-sm-2 col-form-label">Type:</label>
                                <div class="col-sm-4">
                                    <select class="form-control" id="clientType" v-model="reservation.clientType" required>
                                        <option value="">-- Please select --</option>
                                        <option value="walkin">Walk-in</option>
                                        <option value="vip">VIP</option>
                                        <option value="regular">Regular</option>
                                        <option value="group">Group</option>
                                        <option value="corporate">Corporate</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="honeymoon">Honeymoon</option>
                                        <option value="family">Family</option>
                                        <option value="backpacker">Backpacker</option>
                                        <option value="senior">Senior</option>
                                        <option value="disabled">Disabled</option>
                                        <option value="travel_agent">Travel agent</option>
                                    </select>
                                </div>
                            </div>
                            <h4>Booking Details</h4>
                            <div class="form-group row">
                                <label for="checkin" class="col-sm-2 col-form-label">Check-in Date:</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control" id="checkin" v-model="reservation.checkinDate" required readonly>
                                </div>
                                <label for="checkout" class="col-sm-2 col-form-label">Check-out Date:</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control" id="checkout" v-model="reservation.checkoutDate" required readonly>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="room" class="col-sm-2 col-form-label">Room:</label>
                                <div class="col-sm-4">
                                    <select class="form-control" id="room" v-model="reservation.roomName" required>
                                        <option v-for="room in rooms" :value="room">{{ room.name }}</option>
                                    </select>
                                </div>
                                <label for="guests" class="col-sm-2 col-form-label">No. of Guests:</label>
                                <div class="col-sm-4">
                                    <input type="number" class="form-control" id="guests" v-model="reservation.numGuests" required>
                                </div>
                            </div>
                        </form>


                    </div>
                    <div class="modal-footer">
                        <div v-if="this.reservation.status=='reserved'">
                            <button type="button" class="btn btn-primary" @click="removeItem()">Cancel Reservation</button>&nbsp;
                            <button type="button" class="btn btn-success" @click="checkinGuest()">Check-in</button>
                        </div>
                        <div v-else-if="this.reservation.status=='checkedin'">
                            <button type="button" class="btn btn-success" @click="checkOutGuest()">Check-out</button>
                        </div>
                        <button v-else-if="this.reservation.status=='vacant'" type="button" class="btn btn-primary" @click="clickTestAddItem()">Book Now</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="settings-modal" tabindex="-1" role="dialog" aria-labelledby="settings-modalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="settings-modalLabel">Settings</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">

                        <div class="form-group">
                            <label class="form-label">Period UOM</label>
                            <div class="input-group">
                                <select class="form-select" v-model="displayPeriodUom">
                                    <option>month</option>
                                    <option>week</option>
                                    <option>year</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Period Count</label>
                            <div class="input-group">
                                <select class="form-select" v-model="displayPeriodCount">
                                    <option :value="1">1</option>
                                    <option :value="2">2</option>
                                    <option :value="3">3</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Starting day of the week</label>
                            <div class="input-group">
                                <select class="form-select" v-model="startingDayOfWeek">
                                    <option v-for="(d, index) in dayNames" :key="index" :value="index">
                                        {{ d }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group form-check">
                            <input class="form-check-input" type="checkbox" v-model="useTodayIcons" />
                            <label class="form-check-label">Use icon for today's period</label>
                        </div>

                        <div class="form-group form-check">
                            <input class="form-check-input" type="checkbox" v-model="displayWeekNumbers" />
                            <label class="form-check-label">Show week number</label>
                        </div>

                        <div class="form-group form-check">
                            <input class="form-check-input" type="checkbox" v-model="showTimes" />
                            <label class="form-check-label">Show times</label>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Themes</label>
                        </div>

                        <div class="form-group form-check">
                            <input class="form-check-input" type="checkbox" v-model="useDefaultTheme" />
                            <label class="form-check-label">Default</label>
                        </div>

                        <div class="form-group form-check">
                            <input class="form-check-input" type="checkbox" v-model="useHolidayTheme" />
                            <label class="form-check-label">Holidays</label>
                        </div>



                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>





    </div>


</template>
<script>

import "/node_modules/vue-simple-calendar/dist/style.css"
import "/node_modules/vue-simple-calendar/dist/css/default.css"
import "/node_modules/vue-simple-calendar/dist/css/holidays-us.css"
import "/node_modules/vue-final-modal/dist/style.css"

import { CalendarView, CalendarViewHeader, CalendarMath } from "vue-simple-calendar" // published version

export default {
    name: "App",
    components: {
        CalendarView,
        CalendarViewHeader,
    },
    data() {
        return {
            itemIndex: -1,
            reservation: {
                clientName: '',
                clientEmail: '',
                clientPhone: '',
                clientAddress: '',
                clientNationality: '',
                clientType: '',
                checkinDate: '',
                checkoutDate: '',
                roomName: '',
                numGuests: '',
                status:'vacant'
            },           
            showDate: this.thisMonth(1),
            message: "",
            startingDayOfWeek: 0,
            disablePast: false,
            disableFuture: false,
            displayPeriodUom: "month",
            displayPeriodCount: 1,
            displayWeekNumbers: false,
            showTimes: true,
            selectionStart: null,
            selectionEnd: null,
            newItemTitle: "",
            newItemStartDate: "",
            newItemEndDate: "",
            useDefaultTheme: true,
            useHolidayTheme: true,
            useTodayIcons: false,
            bookings:[],
            items: [
                /*{
                    id: id,
                    startDate: this.thisMonth(day, hr, min),
                    endDate: this.thisMonth(day, hr, min),
                    title: book.title,
                    classes: "purple",
                    tooltip: "This spans multiple days hehe",
                },*/
            ],
        }
    },
    computed: {
        userLocale() {
            return CalendarMath.getDefaultBrowserLocale
        },
        dayNames() {
            return CalendarMath.getFormattedWeekdayNames(this.userLocale, "long", 0)
        },
        themeClasses() {
            return {
                "theme-default": this.useDefaultTheme,
                "holiday-us-traditional": this.useHolidayTheme,
                "holiday-us-official": this.useHolidayTheme,
            }
        },
        myDateClasses() {
            // This was added to demonstrate the dateClasses prop. Note in particular that the
            // keys of the object are `yyyy-mm-dd` ISO date strings (not dates), and the values
            // for those keys are strings or string arrays. Keep in mind that your CSS to style these
            // may need to be fairly specific to make it override your theme's styles. See the
            // CSS at the bottom of this component to see how these are styled.
            const o = {}
            const theFirst = this.thisMonth(1)
            const ides = [2, 4, 6, 9].includes(theFirst.getMonth()) ? 15 : 13
            const idesDate = this.thisMonth(ides)
            o[CalendarMath.isoYearMonthDay(idesDate)] = "ides"
            o[CalendarMath.isoYearMonthDay(this.thisMonth(21))] = ["do-you-remember", "the-21st"]
            return o
        },
    },
    mounted() {
        this.newItemStartDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
        this.newItemEndDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
    },

    methods: {
        //generic methods
        toggleItemModal(){
            $("#BookDayModal").modal("toggle");
        },
        changeItemColor(status){
            let item = this.items[this.items.findIndex(o => o.id === this.bookings[this.itemIndex].itemId)];
            if(status==="checkedin"){
                item.classes = ["custom-date-class-green"];
            }
        },
        //methods for reservation
        doVacantRoom(){
            this.bookings[this.itemIndex].status = "vacant";
            this.reservation.status = "vacant";
        },
        checkinGuest(){
            this.bookings[this.itemIndex].status = "checkedin";
            this.changeItemColor("checkedin");
            this.toggleItemModal();
        },
        checkOutGuest(){
            this.doVacantRoom();
            this.removeItem();
            this.toggleItemModal();
        },
        //methods for calendar items
        periodChanged() {
            // range, eventSource) {
            // Demo does nothing with this information, just including the method to demonstrate how
            // you can listen for changes to the displayed range and react to them (by loading items, etc.)
            //console.log(eventSource)
            //console.log(range)
        },
        thisMonth(d, h, m) {
            const t = new Date()
            return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
        },
        onClickDay(d) {
            this.selectionStart = null
            this.selectionEnd = null
            this.message = `You clicked: ${d.toLocaleDateString()}`

            this.toggleItemModal();
            this.reservation.checkinDate = d.toLocaleDateString('en-GB'); 
            this.reservation.checkoutDate = d.toLocaleDateString('en-GB'); 

            this.reservation.status = "vacant";

        },
        onClickItem(e) {
            this.message = `You clicked: ${e.title}`
            this.reservation.clientName = e.title;
            this.reservation.checkinDate = e.startDate.toLocaleDateString('en-GB');
            this.reservation.checkoutDate = e.endDate.toLocaleDateString('en-GB');
            
            this.itemIndex = this.bookings.findIndex(
                o => o.itemId === e.id
            );
            
            this.reservation.status = this.bookings[this.itemIndex].status;

            this.toggleItemModal();
        },
        setShowDate(d) {
            this.message = `Changing calendar view to ${d.toLocaleDateString()}`
            this.showDate = d
        },
        setSelection(dateRange) {
            this.selectionEnd = dateRange[1]
            this.selectionStart = dateRange[0]
        },
        finishSelection(dateRange) {
            this.setSelection(dateRange)
            this.message = `You selected: ${this.selectionStart.toLocaleDateString()} -${this.selectionEnd.toLocaleDateString()}`
            
            this.reservation.status = "vacant";
            this.toggleItemModal();
            this.reservation.checkinDate = this.selectionStart.toLocaleDateString('en-GB') ; 
            this.reservation.checkoutDate = this.selectionEnd.toLocaleDateString('en-GB');
            
        },
        onDrop(item, date) {
            this.message = `You dropped ${item.id} on ${date.toLocaleDateString()}`
            // Determine the delta between the old start date and the date chosen,
            // and apply that delta to both the start and end date to move the item.
            const eLength = CalendarMath.dayDiff(item.startDate, date)
            item.originalItem.startDate = CalendarMath.addDays(item.startDate, eLength)
            item.originalItem.endDate = CalendarMath.addDays(item.endDate, eLength) 
        },
        clickTestAddItem() {

            let id = "e" + Math.random().toString(36).substr(2, 10);
            let startDate = this.reservation.checkinDate.split('/')[2]+"-"+this.reservation.checkinDate.split('/')[1]+"-"+this.reservation.checkinDate.split('/')[0];
            let endDate = this.reservation.checkoutDate.split('/')[2]+"-"+this.reservation.checkoutDate.split('/')[1]+"-"+this.reservation.checkoutDate.split('/')[0];
            let title = this.reservation.clientName;

            this.items.push({
                startDate: startDate,
                endDate: endDate,
                title: title,
                id: id,
                classes: ["custom-date-class-red"]
            })

            this.bookings.push({
                itemId: id,
                status: "reserved",
            })
            
            this.reservation.clientName = "";

            this.message = "You added a calendar item!";
            this.toggleItemModal();
        },
        removeItem(){        
            this.items = this.items.filter(
                o => o.id !== this.bookings[this.itemIndex].itemId
            );
            this.doVacantRoom();      
            this.toggleItemModal();      
        }
    },
}
</script>

<style>
html,
body {
    background-color: #f7fcff;
}

#app {

    font-family: Calibri, sans-serif;
    width: 95vw;
    min-width: 30rem;
    max-width: 100rem;
    min-height: 40rem;
    margin-left: auto;
    margin-right: auto;
}

.calendar-parent {

    overflow-x: hidden;
    overflow-y: hidden;
    height: 720px;
    max-height: 720px;
    background-color: white;
}

/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
    min-height: 6rem;
}

/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */

/* Add some styling for items tagged with the "birthday" class */
.theme-default .cv-item.birthday {
    background-color: #e0f0e0;
    border-color: #d7e7d7;
}

.theme-default .cv-item.birthday::before {
    content: "\1F382";
    /* Birthday cake */
    margin-right: 0.5em;
}

/* The following classes style the classes computed in myDateClasses and passed to the component's dateClasses prop. */
.theme-default .cv-day.ides {
    background-color: #ffe0e0;
}



.cv-item.custom-date-class-red {
    background-color: #f66;
    color: antiquewhite;
}

.cv-item.custom-date-class-green {
    background-color: #0b9d17;
    color: antiquewhite;
}


</style>
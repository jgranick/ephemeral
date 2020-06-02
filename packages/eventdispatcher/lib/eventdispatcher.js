/*!
 * @openfl/eventdispatcher - v0.0.0
 * Compiled Tue, 02 Jun 2020 02:39:13 UTC
 *
 * @openfl/eventdispatcher is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * The EventPhase class provides values for the `eventPhase`
 * property of the Event class.
 */
var EventPhase;
(function (EventPhase) {
    /**
        The target phase, which is the second phase of the event flow.
    **/
    EventPhase[EventPhase["AT_TARGET"] = 2] = "AT_TARGET";
    /**
        The bubbling phase, which is the third phase of the event flow.
    **/
    EventPhase[EventPhase["BUBBLING_PHASE"] = 3] = "BUBBLING_PHASE";
    /**
        The capturing phase, which is the first phase of the event flow.
    **/
    EventPhase[EventPhase["CAPTURING_PHASE"] = 1] = "CAPTURING_PHASE";
})(EventPhase || (EventPhase = {}));
var EventPhase$1 = EventPhase;

// import ObjectPool from "../_internal/utils/ObjectPool";
/**
    The Event class is used as the base class for the creation of Event
    objects, which are passed as parameters to event listeners when an event
    occurs.

    The properties of the Event class carry basic information about an
    event, such as the event's type or whether the event's default behavior can
    be canceled. For many events, such as the events represented by the Event
    class constants, this basic information is sufficient. Other events,
    however, may require more detailed information. Events associated with a
    mouse click, for example, need to include additional information about the
    location of the click event and whether any keys were pressed during the
    click event. You can pass such additional information to event listeners by
    extending the Event class, which is what the MouseEvent class does.
    ActionScript 3.0 API defines several Event subclasses for common events
    that require additional information. Events associated with each of the
    Event subclasses are described in the documentation for each class.

    The methods of the Event class can be used in event listener functions
    to affect the behavior of the event object. Some events have an associated
    default behavior. For example, the `doubleClick` event has an
    associated default behavior that highlights the word under the mouse
    pointer at the time of the event. Your event listener can cancel this
    behavior by calling the `preventDefault()` method. You can also
    make the current event listener the last one to process an event by calling
    the `stopPropagation()` or
    `stopImmediatePropagation()` method.

    Other sources of information include:

    * A useful description about the timing of events, code execution, and
    rendering at runtime in Ted Patrick's blog entry: <a
    [Flash Player Mental Model - The Elastic Racetrack](http://tedpatrick.com/2005/07/19/flash-player-mental-model-the-elastic-racetrack/).
    * A blog entry by Johannes Tacskovics about the timing of frame events,
    such as ENTER_FRAME, EXIT_FRAME: [The MovieClip Lifecycle](http://web.archive.org/web/20110623195412/http://blog.johannest.com:80/2009/06/15/the-movieclip-life-cycle-revisited-from-event-added-to-event-removed_from_stage/).
    * An article by Trevor McCauley about the order of ActionScript
    operations: [Order of Operations in ActionScript](http://web.archive.org/web/20171009141202/http://www.senocular.com:80/flash/tutorials/orderofoperations/).
    * A blog entry by Matt Przybylski on creating custom events:
    [AS3: Custom Events](http://evolve.reintroducing.com/2007/10/23/as3/as3-custom-events/).
**/
let Event = /** @class */ (() => {
    class Event {
        /**
            Creates an Event object to pass as a parameter to event listeners.
    
            @param type       The type of the event, accessible as
                              `Event.type`.
            @param bubbles    Determines whether the Event object participates in the
                              bubbling stage of the event flow. The default value is
                              `false`.
            @param cancelable Determines whether the Event object can be canceled. The
                              default values is `false`.
        **/
        constructor(type, bubbles = false, cancelable = false) {
            this.__type = type;
            this.__bubbles = bubbles;
            this.__cancelable = cancelable;
            this.__eventPhase = EventPhase$1.AT_TARGET;
        }
        /**
            Duplicates an instance of an Event subclass.
    
            Returns a new Event object that is a copy of the original instance of
            the Event object. You do not normally call `clone()`; the
            EventDispatcher class calls it automatically when you redispatch an
            event - that is, when you call `dispatchEvent(event)` from a
            handler that is handling `event`.
    
            The new Event object includes all the properties of the original.
    
            When creating your own custom Event class, you mustthe
            inherited `Event.clone()` method in order for it to duplicate
            the properties of your custom class. If you do not set all the properties
            that you add in your event subclass, those properties will not have the
            correct values when listeners handle the redispatched event.
    
            In this example, `PingEvent` is a subclass of
            `Event` and therefore implements its own version of
            `clone()`.
    
            @return A new Event object that is identical to the original.
        **/
        clone() {
            var event = new Event(this.__type, this.__bubbles, this.__cancelable);
            event.__eventPhase = this.__eventPhase;
            event.__target = this.__target;
            event.__currentTarget = this.__currentTarget;
            return event;
        }
        /**
            A utility for implementing the `toString()` method in custom
            ActionScript 3.0 Event classes. Overriding the `toString()` method is
            recommended, but not required.
    
            ```haxe
            class PingEvent extends Event {
                var URL:String;
    
                public constructor() {
                    super();
                }
    
                publictoString():String {
                    return formatToString("PingEvent", "type", "bubbles", "cancelable", "eventPhase", "URL");
                }
            }
            ```
    
            @param className The name of your custom Event class. In the previous
                             example, the `className` parameter is `PingEvent`.
            @return The name of your custom Event class and the String value of
                    your `...arguments` parameter.
        **/
        formatToString(className, ...parameters) {
            var output = `[${className}`;
            var param = null;
            var value = null;
            for (let i = 0; i < parameters.length; i++) {
                param = parameters[i];
                value = this[param];
                if (typeof value === "string") {
                    output += ` ${param}="${value}"`;
                }
                else {
                    output += ` ${param}=${value}`;
                }
            }
            output += "]";
            return output;
        }
        /**
            Checks whether the `preventDefault()` method has been called on
            the event. If the `preventDefault()` method has been called,
            returns `true`; otherwise, returns `false`.
    
            @return If `preventDefault()` has been called, returns
                    `true`; otherwise, returns `false`.
        **/
        isDefaultPrevented() {
            return this.__preventDefault;
        }
        /**
            Cancels an event's default behavior if that behavior can be canceled.
            Many events have associated behaviors that are carried out by default. For example, if a user types a character into a text field, the default behavior is that the character is displayed in the text field. Because the `TextEvent.TEXT_INPUT` event's default behavior can be canceled, you can use the `preventDefault()` method to prevent the character from appearing.
            An example of a behavior that is not cancelable is the default behavior associated with the Event.REMOVED event, which is generated whenever Flash Player is about to remove a display object from the display list. The default behavior (removing the element) cannot be canceled, so the `preventDefault()` method has no effect on this default behavior.
            You can use the `Event.cancelable` property to check whether you can prevent the default behavior associated with a particular event. If the value of `Event.cancelable` is true, then `preventDefault()` can be used to cancel the event; otherwise, `preventDefault()` has no effect.
        **/
        preventDefault() {
            if (this.__cancelable) {
                this.__preventDefault = true;
            }
        }
        /**
            Prevents processing of any event listeners in the current node and any
            subsequent nodes in the event flow. This method takes effect immediately,
            and it affects event listeners in the current node. In contrast, the
            `stopPropagation()` method doesn't take effect until all the
            event listeners in the current node finish processing.
    
            **Note: ** This method does not cancel the behavior associated with
            this event; see `preventDefault()` for that functionality.
    
        **/
        stopImmediatePropagation() {
            this.__isCanceled = true;
            this.__isCanceledNow = true;
        }
        /**
            Prevents processing of any event listeners in nodes subsequent to the
            current node in the event flow. This method does not affect any event
            listeners in the current node(`currentTarget`). In contrast,
            the `stopImmediatePropagation()` method prevents processing of
            event listeners in both the current node and subsequent nodes. Additional
            calls to this method have no effect. This method can be called in any
            phase of the event flow.
    
            **Note: ** This method does not cancel the behavior associated with
            this event; see `preventDefault()` for that functionality.
    
        **/
        stopPropagation() {
            this.__isCanceled = true;
        }
        /**
            Returns a string containing all the properties of the Event object. The
            string is in the following format:
    
            `[Event type=_value_ bubbles=_value_
            cancelable=_value_]`
    
            @return A string containing all the properties of the Event object.
        **/
        toString() {
            return this.formatToString("Event", "type", "bubbles", "cancelable");
        }
        __init() {
            // type = null;
            this.__target = null;
            this.__currentTarget = null;
            this.__bubbles = false;
            this.__cancelable = false;
            this.__eventPhase = EventPhase$1.AT_TARGET;
            this.__isCanceled = false;
            this.__isCanceledNow = false;
            this.__preventDefault = false;
        }
        // Get & Set Methods
        /**
            Indicates whether an event is a bubbling event. If the event can bubble,
            this value is `true`; otherwise it is `false`.
    
            When an event occurs, it moves through the three phases of the event
            flow: the capture phase, which flows from the top of the display list
            hierarchy to the node just before the target node; the target phase, which
            comprises the target node; and the bubbling phase, which flows from the
            node subsequent to the target node back up the display list hierarchy.
    
            Some events, such as the `activate` and `unload`
            events, do not have a bubbling phase. The `bubbles` property
            has a value of `false` for events that do not have a bubbling
            phase.
        **/
        get bubbles() {
            return this.__bubbles;
        }
        /**
            Indicates whether the behavior associated with the event can be prevented.
            If the behavior can be canceled, this value is `true`;
            otherwise it is `false`.
        **/
        get cancelable() {
            return this.__cancelable;
        }
        /**
            The object that is actively processing the Event object with an event
            listener. For example, if a user clicks an OK button, the current target
            could be the node containing that button or one of its ancestors that has
            registered an event listener for that event.
        **/
        get currentTarget() {
            return this.__currentTarget;
        }
        /**
            The current phase in the event flow. This property can contain the
            following numeric values:
    
            * The capture phase(`EventPhase.CAPTURING_PHASE`).
            * The target phase(`EventPhase.AT_TARGET`).
            * The bubbling phase(`EventPhase.BUBBLING_PHASE`).
        **/
        get eventPhase() {
            return this.__eventPhase;
        }
        /**
            The event target. This property contains the target node. For example, if
            a user clicks an OK button, the target node is the display list node
            containing that button.
        **/
        get target() {
            return this.__target;
        }
        /**
            The type of event. The type is case-sensitive.
        **/
        get type() {
            return this.__type;
        }
    }
    /**
        The `ACTIVATE` constant defines the value of the `type` property of an
        `activate` event object.
        **Note:** This event has neither a "capture phase" nor a "bubble
        phase", which means that event listeners must be added directly to any
        potential targets, whether the target is on the display list or not.

        AIR for TV devices never automatically dispatch this event. You can,
        however, dispatch it manually.

        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any DisplayObject instance with a listener registered for the `activate` event. |
    **/
    Event.ACTIVATE = "activate";
    /**
        The `Event.ADDED` constant defines the value of the `type` property of
        an `added` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `true` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The DisplayObject instance being added to the display list. The `target` is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.ADDED = "added";
    /**
        The `Event.ADDED_TO_STAGE` constant defines the value of the `type`
        property of an `addedToStage` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The DisplayObject instance being added to the on stage display list, either directly or through the addition of a sub tree in which the DisplayObject instance is contained. If the DisplayObject instance is being directly added, the `added` event occurs before this event. |
    **/
    Event.ADDED_TO_STAGE = "addedToStage";
    // /** @hidden */ @:dox(hide) @:require(flash15) public static BROWSER_ZOOM_CHANGE:String;
    /**
        The `Event.CANCEL` constant defines the value of the `type` property
        of a `cancel` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | A reference to the object on which the operation is canceled. |
    **/
    Event.CANCEL = "cancel";
    /**
        The `Event.CHANGE` constant defines the value of the `type` property
        of a `change` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `true` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The object that has had its value modified. The `target` is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.CHANGE = "change";
    // /** @hidden */ @:dox(hide) public static CHANNEL_MESSAGE:String;
    // /** @hidden */ @:dox(hide) public static CHANNEL_STATE:String;
    /**
        The `Event.CLEAR` constant defines the value of the `type` property of
        a `clear` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any InteractiveObject instance with a listener registered for the `clear` event. |

        **Note:** TextField objects do _not_ dispatch `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. TextField objects always include Cut,
        Copy, Paste, Clear, and Select All commands in the context menu. You
        cannot remove these commands from the context menu for TextField
        objects. For TextField objects, selecting these commands (or their
        keyboard equivalents) does not generate `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. However, other classes that extend the
        InteractiveObject class, including components built using the Flash
        Text Engine (FTE), will dispatch these events in response to user
        actions such as keyboard shortcuts and context menus.
    **/
    Event.CLEAR = "clear";
    /**
        The `Event.CLOSE` constant defines the value of the `type` property of
        a `close` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The object whose connection has been closed. |
    **/
    Event.CLOSE = "close";
    /**
        The `Event.COMPLETE` constant defines the value of the `type` property
        of a `complete` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The network object that has completed loading. |
    **/
    Event.COMPLETE = "complete";
    /**
        The `Event.CONNECT` constant defines the value of the `type` property
        of a `connect` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The Socket or XMLSocket object that has established a network connection. |
    **/
    Event.CONNECT = "connect";
    /**
        The `Event.CONTEXT3D_CREATE` constant defines the value of the type property of a
        `context3Dcreate` event object. This event is raised only by Stage3D objects in
        response to either a call to `Stage3D.requestContext3D` or in response to an OS
        triggered reset of the Context3D bound to the Stage3D object. Inspect the
        `Stage3D.context3D` property to get the newly created Context3D object.
    **/
    Event.CONTEXT3D_CREATE = "context3DCreate";
    /**
        Defines the value of the `type` property of a `copy` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any InteractiveObject instance with a listener registered for the `copy` event. |

        **Note:** TextField objects do _not_ dispatch `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. TextField objects always include Cut,
        Copy, Paste, Clear, and Select All commands in the context menu. You
        cannot remove these commands from the context menu for TextField
        objects. For TextField objects, selecting these commands (or their
        keyboard equivalents) does not generate `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. However, other classes that extend the
        InteractiveObject class, including components built using the Flash
        Text Engine (FTE), will dispatch these events in response to user
        actions such as keyboard shortcuts and context menus.
    **/
    Event.COPY = "copy";
    /**
        Defines the value of the `type` property of a `cut` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any InteractiveObject instance with a listener registered for the `cut` event. |

        **Note:** TextField objects do _not_ dispatch `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. TextField objects always include Cut,
        Copy, Paste, Clear, and Select All commands in the context menu. You
        cannot remove these commands from the context menu for TextField
        objects. For TextField objects, selecting these commands (or their
        keyboard equivalents) does not generate `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. However, other classes that extend the
        InteractiveObject class, including components built using the Flash
        Text Engine (FTE), will dispatch these events in response to user
        actions such as keyboard shortcuts and context menus.
    **/
    Event.CUT = "cut";
    /**
        The `Event.DEACTIVATE` constant defines the value of the `type`
        property of a `deactivate` event object.
        **Note:** This event has neither a "capture phase" nor a "bubble
        phase", which means that event listeners must be added directly to any
        potential targets, whether the target is on the display list or not.

        AIR for TV devices never automatically dispatch this event. You can,
        however, dispatch it manually.

        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any DisplayObject instance with a listener registered for the `deactivate` event. |
    **/
    Event.DEACTIVATE = "deactivate";
    /**
        The `Event.ENTER_FRAME` constant defines the value of the `type`
        property of an `enterFrame` event object.
        **Note:** This event has neither a "capture phase" nor a "bubble
        phase", which means that event listeners must be added directly to any
        potential targets, whether the target is on the display list or not.

        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any DisplayObject instance with a listener registered for the `enterFrame` event. |
    **/
    Event.ENTER_FRAME = "enterFrame";
    /**
        The `Event.EXIT_FRAME` constant defines the value of the `type`
        property of an `exitFrame` event object.
        **Note:** This event has neither a "capture phase" nor a "bubble
        phase", which means that event listeners must be added directly to any
        potential targets, whether the target is on the display list or not.

        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any DisplayObject instance with a listener registered for the `enterFrame` event. |
    **/
    Event.EXIT_FRAME = "exitFrame";
    /**
        The `Event.FRAME_CONSTRUCTED` constant defines the value of the `type`
        property of an `frameConstructed` event object.
        **Note:** This event has neither a "capture phase" nor a "bubble
        phase", which means that event listeners must be added directly to any
        potential targets, whether the target is on the display list or not.

        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any DisplayObject instance with a listener registered for the `frameConstructed` event. |
    **/
    Event.FRAME_CONSTRUCTED = "frameConstructed";
    /**
        The `Event.FRAME_LABEL` constant defines the value of the type property of a
        `frameLabel` event object.

        **Note:** This event has neither a "capture phase" nor a "bubble phase", which
        means that event listeners must be added directly to FrameLabel objects.

        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The FrameLabel object that is actively processing the Event object with an event listener. |
        | `target` | Any FrameLabel instance with a listener registered for the frameLabel event. |
    **/
    Event.FRAME_LABEL = "frameLabel";
    /**
        The `Event.FULL_SCREEN` constant defines the value of the `type`
        property of a `fullScreen` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The Stage object. |
    **/
    Event.FULLSCREEN = "fullScreen";
    /**
        The `Event.ID3` constant defines the value of the `type` property of
        an `id3` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The Sound object loading the MP3 for which ID3 data is now available. The `target` is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.ID3 = "id3";
    /**
        The `Event.INIT` constant defines the value of the `type` property of
        an `init` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The LoaderInfo object associated with the SWF file being loaded. |
    **/
    Event.INIT = "init";
    /**
        The `Event.MOUSE_LEAVE` constant defines the value of the `type`
        property of a `mouseLeave` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The Stage object. The `target` is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.MOUSE_LEAVE = "mouseLeave";
    /**
        The `Event.OPEN` constant defines the value of the `type` property of
        an `open` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The network object that has opened a connection. |
    **/
    Event.OPEN = "open";
    /**
        The `Event.PASTE` constant defines the value of the `type` property of
        a `paste` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any InteractiveObject instance with a listener registered for the `paste` event. |

        **Note:** TextField objects do _not_ dispatch `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. TextField objects always include Cut,
        Copy, Paste, Clear, and Select All commands in the context menu. You
        cannot remove these commands from the context menu for TextField
        objects. For TextField objects, selecting these commands (or their
        keyboard equivalents) does not generate `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. However, other classes that extend the
        InteractiveObject class, including components built using the Flash
        Text Engine (FTE), will dispatch these events in response to user
        actions such as keyboard shortcuts and context menus.
    **/
    Event.PASTE = "paste";
    /**
        The `Event.REMOVED` constant defines the value of the `type` property
        of a `removed` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `true` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The DisplayObject instance to be removed from the display list. The `target` is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.REMOVED = "removed";
    /**
        The `Event.REMOVED_FROM_STAGE` constant defines the value of the
        `type` property of a `removedFromStage` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The DisplayObject instance being removed from the on stage display list, either directly or through the removal of a sub tree in which the DisplayObject instance is contained. If the DisplayObject instance is being directly removed, the `removed` event occurs before this event. |
    **/
    Event.REMOVED_FROM_STAGE = "removedFromStage";
    /**
        The `Event.RENDER` constant defines the value of the `type` property
        of a `render` event object.
        **Note:** This event has neither a "capture phase" nor a "bubble
        phase", which means that event listeners must be added directly to any
        potential targets, whether the target is on the display list or not.

        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; the default behavior cannot be canceled. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any DisplayObject instance with a listener registered for the `render` event. |
    **/
    Event.RENDER = "render";
    /**
        The `Event.RESIZE` constant defines the value of the `type` property
        of a `resize` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The Stage object. |
    **/
    Event.RESIZE = "resize";
    /**
        The `Event.SCROLL` constant defines the value of the `type` property
        of a `scroll` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The TextField object that has been scrolled. The `target` property is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.SCROLL = "scroll";
    /**
        The `Event.SELECT` constant defines the value of the `type` property
        of a `select` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The object on which an item has been selected. |
    **/
    Event.SELECT = "select";
    /**
        The `Event.SELECT_ALL` constant defines the value of the `type`
        property of a `selectAll` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | Any InteractiveObject instance with a listener registered for the `selectAll` event. |

        **Note:** TextField objects do _not_ dispatch `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. TextField objects always include Cut,
        Copy, Paste, Clear, and Select All commands in the context menu. You
        cannot remove these commands from the context menu for TextField
        objects. For TextField objects, selecting these commands (or their
        keyboard equivalents) does not generate `clear`, `copy`, `cut`,
        `paste`, or `selectAll` events. However, other classes that extend the
        InteractiveObject class, including components built using the Flash
        Text Engine (FTE), will dispatch these events in response to user
        actions such as keyboard shortcuts and context menus.
    **/
    Event.SELECT_ALL = "selectAll";
    /**
        The `Event.SOUND_COMPLETE` constant defines the value of the `type`
        property of a `soundComplete` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The SoundChannel object in which a sound has finished playing. |
    **/
    Event.SOUND_COMPLETE = "soundComplete";
    /**
        The `Event.TAB_CHILDREN_CHANGE` constant defines the value of the
        `type` property of a `tabChildrenChange` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `true` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The object whose tabChildren flag has changed. The `target` is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.TAB_CHILDREN_CHANGE = "tabChildrenChange";
    /**
        The `Event.TAB_ENABLED_CHANGE` constant defines the value of the
        `type` property of a `tabEnabledChange` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `true` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The InteractiveObject whose tabEnabled flag has changed. The `target` is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.TAB_ENABLED_CHANGE = "tabEnabledChange";
    /**
        The `Event.TAB_INDEX_CHANGE` constant defines the value of the `type`
        property of a `tabIndexChange` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `true` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The object whose tabIndex has changed. The `target` is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    Event.TAB_INDEX_CHANGE = "tabIndexChange";
    /**
        The `Event.TEXTURE_READY` constant defines the value of the type property of a
        `textureReady` event object. This event is dispatched by Texture and CubeTexture
        objects to signal the completion of an asynchronous upload. Request an asynchronous
        upload by using the `uploadCompressedTextureFromByteArray()` method on Texture or
        CubeTexture. This event neither bubbles nor is cancelable.
    **/
    Event.TEXTURE_READY = "textureReady";
    /**
        The `Event.TEXT_INTERACTION_MODE_CHANGE` constant defines the value of
        the `type` property of a `interaction mode` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The TextField object whose interaction mode property is changed. For example on Android, one can change the interaction mode to SELECTION via context menu. The `target` property is not always the object in the display list that registered the event listener. Use the `currentTarget` property to access the object in the display list that is currently processing the event. |
    **/
    // /** @hidden */ @:dox(hide) @:require(flash11) public static TEXT_INTERACTION_MODE_CHANGE:String;
    /**
        The `Event.UNLOAD` constant defines the value of the `type` property
        of an `unload` event object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The LoaderInfo object associated with the SWF file being unloaded or replaced. |
    **/
    Event.UNLOAD = "unload";
    return Event;
})();

/**
        The EventDispatcher class is the base class for all classes that dispatch
        events. The EventDispatcher class implements the IEventDispatcher interface
        and is the base class for the DisplayObject class. The EventDispatcher
        class allows any object on the display list to be an event target and as
        such, to use the methods of the IEventDispatcher interface.

        Event targets are an important part of the Flash<sup>®</sup> Player and
        Adobe<sup>®</sup> AIR<sup>®</sup> event model. The event target serves as
        the focal point for how events flow through the display list hierarchy.
        When an event such as a mouse click or a keypress occurs, Flash Player or
        the AIR application dispatches an event object into the event flow from the
        root of the display list. The event object then makes its way through the
        display list until it reaches the event target, at which point it begins
        its return trip through the display list. This round-trip journey to the
        event target is conceptually divided into three phases: the capture phase
        comprises the journey from the root to the last node before the event
        target's node, the target phase comprises only the event target node, and
        the bubbling phase comprises any subsequent nodes encountered on the return
        trip to the root of the display list.

        In general, the easiest way for a user-defined class to gain event
        dispatching capabilities is to extend EventDispatcher. If this is
        impossible(that is, if the class is already extending another class), you
        can instead implement the IEventDispatcher interface, create an
        EventDispatcher member, and write simple hooks to route calls into the
        aggregated EventDispatcher.

        @event activate   [broadcast event] Dispatched when the Flash Player or AIR
                          application gains operating system focus and becomes
                          active. This event is a broadcast event, which means that
                          it is dispatched by all EventDispatcher objects with a
                          listener registered for this event. For more information
                          about broadcast events, see the DisplayObject class.
        @event deactivate [broadcast event] Dispatched when the Flash Player or AIR
                          application operating loses system focus and is becoming
                          inactive. This event is a broadcast event, which means
                          that it is dispatched by all EventDispatcher objects with
                          a listener registered for this event. For more
                          information about broadcast events, see the DisplayObject
                          class.
    **/
class EventDispatcher {
    /**
        Aggregates an instance of the EventDispatcher class.

        The EventDispatcher class is generally used as a base class, which
        means that most developers do not need to use this constructor function.
        However, advanced developers who are implementing the IEventDispatcher
        interface need to use this constructor. If you are unable to extend the
        EventDispatcher class and must instead implement the IEventDispatcher
        interface, use this constructor to aggregate an instance of the
        EventDispatcher class.

        @param target The target object for events dispatched to the
                      EventDispatcher object. This parameter is used when the
                      EventDispatcher instance is aggregated by a class that
                      implements IEventDispatcher; it is necessary so that the
                      containing object can be the target for events. Do not use
                      this parameter in simple cases in which a class extends
                      EventDispatcher.
    **/
    constructor(target = null) {
        if (target != null) {
            this.__targetDispatcher = target;
        }
    }
    /**
        Registers an event listener object with an EventDispatcher object so that
        the listener receives notification of an event. You can register event
        listeners on all nodes in the display list for a specific type of event,
        phase, and priority.

        After you successfully register an event listener, you cannot change
        its priority through additional calls to `addEventListener()`.
        To change a listener's priority, you must first call
        `removeListener()`. Then you can register the listener again
        with the new priority level.

        Keep in mind that after the listener is registered, subsequent calls to
        `addEventListener()` with a different `type` or
        `useCapture` value result in the creation of a separate
        listener registration. For example, if you first register a listener with
        `useCapture` set to `true`, it listens only during
        the capture phase. If you call `addEventListener()` again using
        the same listener object, but with `useCapture` set to
        `false`, you have two separate listeners: one that listens
        during the capture phase and another that listens during the target and
        bubbling phases.

        You cannot register an event listener for only the target phase or the
        bubbling phase. Those phases are coupled during registration because
        bubbling applies only to the ancestors of the target node.

        If you no longer need an event listener, remove it by calling
        `removeEventListener()`, or memory problems could result. Event
        listeners are not automatically removed from memory because the garbage
        collector does not remove the listener as long as the dispatching object
        exists(unless the `useWeakReference` parameter is set to
        `true`).

        Copying an EventDispatcher instance does not copy the event listeners
        attached to it.(If your newly created node needs an event listener, you
        must attach the listener after creating the node.) However, if you move an
        EventDispatcher instance, the event listeners attached to it move along
        with it.

        If the event listener is being registered on a node while an event is
        being processed on this node, the event listener is not triggered during
        the current phase but can be triggered during a later phase in the event
        flow, such as the bubbling phase.

        If an event listener is removed from a node while an event is being
        processed on the node, it is still triggered by the current actions. After
        it is removed, the event listener is never invoked again(unless
        registered again for future processing).

        @param type             The type of event.
        @param useCapture       Determines whether the listener works in the
                                capture phase or the target and bubbling phases.
                                If `useCapture` is set to
                                `true`, the listener processes the
                                event only during the capture phase and not in the
                                target or bubbling phase. If
                                `useCapture` is `false`, the
                                listener processes the event only during the
                                target or bubbling phase. To listen for the event
                                in all three phases, call
                                `addEventListener` twice, once with
                                `useCapture` set to `true`,
                                then again with `useCapture` set to
                                `false`.
        @param priority         The priority level of the event listener. The
                                priority is designated by a signed 32-bit integer.
                                The higher the number, the higher the priority.
                                All listeners with priority _n_ are processed
                                before listeners of priority _n_-1. If two or
                                more listeners share the same priority, they are
                                processed in the order in which they were added.
                                The default priority is 0.
        @param useWeakReference Determines whether the reference to the listener
                                is strong or weak. A strong reference(the
                                default) prevents your listener from being
                                garbage-collected. A weak reference does not.

                                Class-level member functions are not subject to
                                garbage collection, so you can set
                                `useWeakReference` to `true`
                                for class-level member functions without
                                subjecting them to garbage collection. If you set
                                `useWeakReference` to `true`
                                for a listener that is a nested inner function,
                                the will be garbage-collected and no
                                longer persistent. If you create references to the
                                inner function(save it in another variable) then
                                it is not garbage-collected and stays
                                persistent.
        @throws ArgumentError The `listener` specified is not a
                              function.
    **/
    addEventListener(type, listener, useCapture = false, priority = 0, useWeakReference = false) {
        if (listener == null)
            return;
        if (this.__eventMap == null) {
            this.__eventMap = new Map();
            this.__iterators = new Map();
        }
        if (!this.__eventMap.has(type)) {
            var list = new Array();
            list.push(new Listener(listener, useCapture, priority));
            var iterator = new DispatchIterator(list);
            this.__eventMap.set(type, list);
            this.__iterators.set(type, [iterator]);
        }
        else {
            var list = this.__eventMap.get(type);
            for (let item of list) {
                if (item.match(listener, useCapture))
                    return;
            }
        }
        var iterators = this.__iterators.get(type);
        for (let iterator of iterators) {
            if (iterator.active) {
                iterator.copy();
            }
        }
        this.__addListenerByPriority(list, new Listener(listener, useCapture, priority));
    }
    /**
        Dispatches an event into the event flow. The event target is the
        EventDispatcher object upon which the `dispatchEvent()` method
        is called.

        @param event The Event object that is dispatched into the event flow. If
                     the event is being redispatched, a clone of the event is
                     created automatically. After an event is dispatched, its
                     `target` property cannot be changed, so you must
                     create a new copy of the event for redispatching to work.
        @return A value of `true` if the event was successfully
                dispatched. A value of `false` indicates failure or
                that `preventDefault()` was called on the event.
        @throws Error The event dispatch recursion limit has been reached.
    **/
    dispatchEvent(event) {
        if (this.__targetDispatcher != null) {
            event.__target = this.__targetDispatcher;
        }
        else {
            event.__target = this;
        }
        return this.__dispatchEvent(event);
    }
    /**
        Checks whether the EventDispatcher object has any listeners registered for
        a specific type of event. This allows you to determine where an
        EventDispatcher object has altered handling of an event type in the event
        flow hierarchy. To determine whether a specific event type actually
        triggers an event listener, use `willTrigger()`.

        The difference between `hasEventListener()` and
        `willTrigger()` is that `hasEventListener()`
        examines only the object to which it belongs, whereas
        `willTrigger()` examines the entire event flow for the event
        specified by the `type` parameter.

        When `hasEventListener()` is called from a LoaderInfo
        object, only the listeners that the caller can access are considered.

        @param type The type of event.
        @return A value of `true` if a listener of the specified type
                is registered; `false` otherwise.
    **/
    hasEventListener(type) {
        if (this.__eventMap == null)
            return false;
        return this.__eventMap.has(type);
    }
    /**
        Removes a listener from the EventDispatcher object. If there is no
        matching listener registered with the EventDispatcher object, a call to
        this method has no effect.

        @param type       The type of event.
        @param useCapture Specifies whether the listener was registered for the
                          capture phase or the target and bubbling phases. If the
                          listener was registered for both the capture phase and
                          the target and bubbling phases, two calls to
                          `removeEventListener()` are required to
                          remove both, one call with `useCapture()` set
                          to `true`, and another call with
                          `useCapture()` set to `false`.
    **/
    removeEventListener(type, listener, useCapture = false) {
        if (this.__eventMap == null || listener == null)
            return;
        var list = this.__eventMap.get(type);
        if (list == null)
            return;
        var iterators = this.__iterators.get(type);
        for (let i = 0; i < list.length; i++) {
            if (list[i].match(listener, useCapture)) {
                for (let iterator of iterators) {
                    iterator.remove(list[i], i);
                }
                list.splice(i, 1);
                break;
            }
        }
        if (list.length == 0) {
            this.__eventMap.delete(type);
            this.__iterators.delete(type);
        }
        if (this.__eventMap.size == 0) {
            this.__eventMap = null;
            this.__iterators = null;
        }
    }
    toString() {
        return "[object " + this.constructor.name + "]";
    }
    /**
        Checks whether an event listener is registered with this EventDispatcher
        object or any of its ancestors for the specified event type. This method
        returns `true` if an event listener is triggered during any
        phase of the event flow when an event of the specified type is dispatched
        to this EventDispatcher object or any of its descendants.

        The difference between the `hasEventListener()` and the
        `willTrigger()` methods is that `hasEventListener()`
        examines only the object to which it belongs, whereas the
        `willTrigger()` method examines the entire event flow for the
        event specified by the `type` parameter.

        When `willTrigger()` is called from a LoaderInfo object,
        only the listeners that the caller can access are considered.

        @param type The type of event.
        @return A value of `true` if a listener of the specified type
                will be triggered; `false` otherwise.
    **/
    willTrigger(type) {
        return this.hasEventListener(type);
    }
    __dispatchEvent(event) {
        if (this.__eventMap == null || event == null)
            return true;
        var type = event.type;
        var list = this.__eventMap.get(type);
        if (list == null)
            return true;
        if (event.__target == null) {
            if (this.__targetDispatcher != null) {
                event.__target = this.__targetDispatcher;
            }
            else {
                event.__target = this;
            }
        }
        event.__currentTarget = this;
        var capture = (event.eventPhase == EventPhase$1.CAPTURING_PHASE);
        var iterators = this.__iterators.get(type);
        var iterator = iterators[0];
        if (iterator.active) {
            iterator = new DispatchIterator(list);
            iterators.push(iterator);
        }
        iterator.start();
        for (let listener of iterator) {
            if (listener == null)
                continue;
            if (listener.useCapture == capture) {
                // listener.callback (event.clone ());
                listener.callback(event);
                if (event.__isCanceledNow) {
                    break;
                }
            }
        }
        iterator.stop();
        if (iterator != iterators[0]) {
            let i = iterators.indexOf(iterator);
            if (i > -1)
                iterators.splice(i, 1);
        }
        else {
            iterator.reset(list);
        }
        return !event.isDefaultPrevented();
    }
    /** @hidden */
    __removeAllListeners() {
        this.__eventMap = null;
        this.__iterators = null;
    }
    /** @hidden */
    __addListenerByPriority(list, listener) {
        var numElements = list.length;
        var addAtPosition = numElements;
        for (let i = 0; i < numElements; i++) {
            if (list[i].priority < listener.priority) {
                addAtPosition = i;
                break;
            }
        }
        list.splice(addAtPosition, 0, listener);
    }
}
class DispatchIterator {
    constructor(list) {
        this.active = false;
        this.reset(list);
    }
    copy() {
        if (!this.isCopy) {
            this.list = this.list.slice();
            this.isCopy = true;
        }
    }
    [Symbol.iterator]() {
        return this;
    }
    next() {
        return { value: this.list[this.index++], done: this.index < this.list.length };
    }
    remove(listener, listIndex) {
        if (this.active) {
            if (!this.isCopy) {
                if (listIndex < this.index) {
                    this.index--;
                }
            }
            else {
                for (let i = this.index; i < this.list.length; i++) {
                    if (this.list[i] == listener) {
                        this.list.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    reset(list) {
        this.list = list;
        this.isCopy = false;
        this.index = 0;
    }
    start() {
        this.active = true;
    }
    stop() {
        this.active = false;
    }
}
class Listener {
    constructor(callback, useCapture, priority) {
        this.callback = callback;
        this.useCapture = useCapture;
        this.priority = priority;
    }
    match(callback, useCapture) {
        return (this.callback === callback && this.useCapture == useCapture);
    }
}

// import ObjectPool from "../_internal/utils/ObjectPool";
/**
    A ProgressEvent object is dispatched when a load operation has begun or a
    socket has received data. These events are usually generated when SWF
    files, images or data are loaded into an application. There are two types
    of progress events: `ProgressEvent.PROGRESS` and
    `ProgressEvent.SOCKET_DATA`. Additionally, in AIR ProgressEvent
    objects are dispatched when a data is sent to or from a child process using
    the NativeProcess class.
**/
let ProgressEvent = /** @class */ (() => {
    class ProgressEvent extends Event {
        // protected static __pool: ObjectPool<ProgressEvent> = new ObjectPool<ProgressEvent>(() => new ProgressEvent(null),
        // 	(event) => event.__init());
        /**
            Creates an Event object that contains information about progress events.
            Event objects are passed as parameters to event listeners.
    
            @param type        The type of the event. Possible values
                               are:`ProgressEvent.PROGRESS`,
                               `ProgressEvent.SOCKET_DATA`,
                               `ProgressEvent.STANDARD_ERROR_DATA`,
                               `ProgressEvent.STANDARD_INPUT_PROGRESS`, and
                               `ProgressEvent.STANDARD_OUTPUT_DATA`.
            @param bubbles     Determines whether the Event object participates in the
                               bubbling stage of the event flow.
            @param cancelable  Determines whether the Event object can be canceled.
            @param bytesLoaded The number of items or bytes loaded at the time the
                               listener processes the event.
            @param bytesTotal  The total number of items or bytes that will be loaded
                               if the loading process succeeds.
        **/
        constructor(type, bubbles = false, cancelable = false, bytesLoaded = 0, bytesTotal = 0) {
            super(type, bubbles, cancelable);
            this.bytesLoaded = bytesLoaded;
            this.bytesTotal = bytesTotal;
        }
        clone() {
            var event = new ProgressEvent(this.__type, this.__bubbles, this.__cancelable, this.bytesLoaded, this.bytesTotal);
            event.__target = this.__target;
            event.__currentTarget = this.__currentTarget;
            event.__eventPhase = this.__eventPhase;
            return event;
        }
        toString() {
            return this.formatToString("ProgressEvent", "type", "bubbles", "cancelable", "bytesLoaded", "bytesTotal");
        }
        __init() {
            super.__init();
            this.bytesLoaded = 0;
            this.bytesTotal = 0;
        }
    }
    /**
        Defines the value of the `type` property of a `progress` event object.

        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `bytesLoaded` | The number of items or bytes loaded at the time the listener processes the event. |
        | `bytesTotal` | The total number of items or bytes that ultimately will be loaded if the loading process succeeds. |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event object with an event listener. |
        | `target` | The object reporting progress.  |
    **/
    ProgressEvent.PROGRESS = "progress";
    /**
        Defines the value of the `type` property of a `socketData` event
        object.
        This event has the following properties:

        | Property | Value |
        | --- | --- |
        | `bubbles` | `false` |
        | `cancelable` | `false`; there is no default behavior to cancel. |
        | `currentTarget` | The object that is actively processing the Event. |
        | `bytesLoaded` | The number of items or bytes loaded at the time the listener processes the event. |
        | `bytesTotal` | 0; this property is not used by `socketData` event objects. |
        | `target` | The socket reporting progress. |
    **/
    ProgressEvent.SOCKET_DATA = "socketData";
    return ProgressEvent;
})();

exports.Event = Event;
exports.EventDispatcher = EventDispatcher;
exports.EventPhase = EventPhase$1;
exports.ProgressEvent = ProgressEvent;
//# sourceMappingURL=eventdispatcher.js.map
